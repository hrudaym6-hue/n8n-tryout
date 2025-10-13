#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple

class CobolEntityExtractor:
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.entities_by_file = []
        
    def find_cobol_files(self) -> List[Path]:
        cobol_files = []
        search_paths = [
            self.repo_path / 'app' / 'cbl',
            self.repo_path / 'app' / 'app-authorization-ims-db2-mq' / 'cbl',
            self.repo_path / 'app' / 'app-transaction-type-db2' / 'cbl',
            self.repo_path / 'app' / 'app-vsam-mq' / 'cbl'
        ]
        
        for search_path in search_paths:
            if search_path.exists():
                cobol_files.extend(search_path.glob('*.cbl'))
                cobol_files.extend(search_path.glob('*.CBL'))
        
        return sorted(cobol_files)
    
    def normalize_line(self, line: str) -> str:
        if len(line) > 6:
            return line[6:]
        return line
    
    def is_comment_line(self, line: str) -> bool:
        if len(line) > 6 and line[6] in ('*', '/'):
            return True
        return False
    
    def extract_program_id(self, lines: List[str]) -> str:
        for line in lines:
            if 'PROGRAM-ID' in line.upper():
                match = re.search(r'PROGRAM-ID\.\s+(\w+)', line, re.IGNORECASE)
                if match:
                    return match.group(1)
        return ""
    
    def extract_variables(self, lines: List[str], file_path: str) -> List[Dict]:
        variables = []
        in_working_storage = False
        in_linkage_section = False
        in_file_section = False
        current_scope = ""
        
        for line_num, raw_line in enumerate(lines, 1):
            if self.is_comment_line(raw_line):
                continue
                
            line = self.normalize_line(raw_line).strip()
            
            if 'WORKING-STORAGE SECTION' in line.upper():
                in_working_storage = True
                in_linkage_section = False
                in_file_section = False
                current_scope = "WORKING-STORAGE"
            elif 'LINKAGE SECTION' in line.upper():
                in_working_storage = False
                in_linkage_section = True
                in_file_section = False
                current_scope = "LINKAGE"
            elif 'FILE SECTION' in line.upper():
                in_working_storage = False
                in_linkage_section = False
                in_file_section = True
                current_scope = "FILE"
            elif 'PROCEDURE DIVISION' in line.upper():
                in_working_storage = False
                in_linkage_section = False
                in_file_section = False
            
            if (in_working_storage or in_linkage_section or in_file_section):
                match = re.match(r'\s*(\d+)\s+([A-Z0-9\-]+)\s+PIC\s+([\w\(\)]+)', line, re.IGNORECASE)
                if match:
                    level = match.group(1)
                    name = match.group(2)
                    pic_type = match.group(3)
                    
                    default_value = ""
                    value_match = re.search(r'VALUE\s+([\w\'\"\-\s]+)', line, re.IGNORECASE)
                    if value_match:
                        default_value = value_match.group(1).strip()
                    
                    usage = ""
                    if re.search(r'\bCOMP-3\b', line, re.IGNORECASE):
                        usage = "COMP-3"
                    elif re.search(r'\bCOMP\b', line, re.IGNORECASE):
                        usage = "COMP"
                    elif re.search(r'\bBINARY\b', line, re.IGNORECASE):
                        usage = "BINARY"
                    
                    variables.append({
                        "name": name,
                        "type": pic_type,
                        "scope": current_scope,
                        "default_value": default_value,
                        "location": f"{file_path}:{line_num}",
                        "usage": usage,
                        "level": level
                    })
        
        return variables
    
    def extract_constants(self, lines: List[str], file_path: str) -> List[Dict]:
        constants = []
        parent_variable = ""
        parent_type = ""
        current_scope = ""
        
        for line_num, raw_line in enumerate(lines, 1):
            if self.is_comment_line(raw_line):
                continue
                
            line = self.normalize_line(raw_line).strip()
            
            if 'WORKING-STORAGE SECTION' in line.upper():
                current_scope = "WORKING-STORAGE"
            elif 'LINKAGE SECTION' in line.upper():
                current_scope = "LINKAGE"
            elif 'PROCEDURE DIVISION' in line.upper():
                break
            
            parent_match = re.match(r'\s*(\d+)\s+([A-Z0-9\-]+)\s+PIC\s+([\w\(\)]+)', line, re.IGNORECASE)
            if parent_match and parent_match.group(1) != '88':
                parent_variable = parent_match.group(2)
                parent_type = parent_match.group(3)
            
            match = re.match(r'\s*88\s+([A-Z0-9\-]+)\s+VALUE[S]?\s+(.*)', line, re.IGNORECASE)
            if match:
                name = match.group(1)
                values = match.group(2).strip().rstrip('.')
                
                constants.append({
                    "name": name,
                    "type": parent_type,
                    "values": values,
                    "scope": current_scope,
                    "parent": parent_variable,
                    "location": f"{file_path}:{line_num}"
                })
        
        return constants
    
    def extract_functions(self, lines: List[str], file_path: str) -> Tuple[List[Dict], Dict[str, List[str]]]:
        functions = []
        relationships = {}
        in_procedure_division = False
        current_paragraph = None
        
        for line_num, raw_line in enumerate(lines, 1):
            if self.is_comment_line(raw_line):
                continue
                
            line = self.normalize_line(raw_line).strip()
            
            if 'PROCEDURE DIVISION' in line.upper():
                in_procedure_division = True
                continue
            
            if in_procedure_division:
                para_match = re.match(r'^([A-Z0-9\-]+)\.$', line, re.IGNORECASE)
                if para_match:
                    para_name = para_match.group(1)
                    functions.append({
                        "name": para_name,
                        "parameters": [],
                        "return_type": None,
                        "access_level": "public",
                        "location": f"{file_path}:{line_num}",
                        "relationships": {
                            "calls": [],
                            "is_called_by": []
                        }
                    })
                    current_paragraph = para_name
                    relationships[para_name] = []
                
                if current_paragraph:
                    perform_matches = re.findall(r'PERFORM\s+([A-Z0-9\-]+)', line, re.IGNORECASE)
                    for called_para in perform_matches:
                        if called_para.upper() not in ['UNTIL', 'VARYING', 'TIMES', 'THRU', 'THROUGH']:
                            if current_paragraph in relationships:
                                relationships[current_paragraph].append(called_para)
        
        for func in functions:
            func_name = func["name"]
            if func_name in relationships:
                func["relationships"]["calls"] = list(set(relationships[func_name]))
            
            for other_func, called_list in relationships.items():
                if func_name in called_list:
                    func["relationships"]["is_called_by"].append(other_func)
        
        return functions, relationships
    
    def extract_modules(self, lines: List[str], file_path: str) -> List[Dict]:
        modules = []
        program_id = self.extract_program_id(lines)
        
        copybooks = []
        for line_num, raw_line in enumerate(lines, 1):
            if self.is_comment_line(raw_line):
                continue
                
            line = self.normalize_line(raw_line).strip()
            
            copy_match = re.search(r'COPY\s+([A-Z0-9]+)', line, re.IGNORECASE)
            if copy_match:
                copybooks.append(copy_match.group(1))
        
        if program_id:
            modules.append({
                "name": program_id,
                "imports": list(set(copybooks)),
                "exports": [program_id],
                "internal_structure": "COBOL Program",
                "location": f"{file_path}:1"
            })
        
        return modules
    
    def extract_classes(self, lines: List[str], file_path: str) -> List[Dict]:
        classes = []
        in_data_division = False
        current_01_item = None
        current_properties = []
        
        for line_num, raw_line in enumerate(lines, 1):
            if self.is_comment_line(raw_line):
                continue
                
            line = self.normalize_line(raw_line).strip()
            
            if 'DATA DIVISION' in line.upper():
                in_data_division = True
            elif 'PROCEDURE DIVISION' in line.upper():
                if current_01_item and current_properties:
                    classes.append({
                        "name": current_01_item["name"],
                        "inheritance": None,
                        "properties": current_properties,
                        "methods": [],
                        "location": current_01_item["location"]
                    })
                break
            
            if in_data_division:
                match_01 = re.match(r'\s*01\s+([A-Z0-9\-]+)(?:\s+PIC|\s*\.|\s+REDEFINES)?', line, re.IGNORECASE)
                if match_01 and 'PIC' not in line.upper():
                    if current_01_item and current_properties:
                        classes.append({
                            "name": current_01_item["name"],
                            "inheritance": None,
                            "properties": current_properties,
                            "methods": [],
                            "location": current_01_item["location"]
                        })
                    
                    current_01_item = {
                        "name": match_01.group(1),
                        "location": f"{file_path}:{line_num}"
                    }
                    current_properties = []
                
                elif current_01_item:
                    sub_match = re.match(r'\s*(0[2-9]|[1-9]\d)\s+([A-Z0-9\-]+)\s+PIC\s+([\w\(\)]+)', line, re.IGNORECASE)
                    if sub_match:
                        current_properties.append({
                            "name": sub_match.group(2),
                            "type": sub_match.group(3),
                            "level": sub_match.group(1)
                        })
        
        return classes
    
    def extract_file_entities(self, file_path: Path) -> Dict:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None
        
        rel_path = file_path.relative_to(self.repo_path)
        
        variables = self.extract_variables(lines, str(rel_path))
        constants = self.extract_constants(lines, str(rel_path))
        functions, _ = self.extract_functions(lines, str(rel_path))
        modules = self.extract_modules(lines, str(rel_path))
        classes = self.extract_classes(lines, str(rel_path))
        
        return {
            "file": str(rel_path),
            "entities": {
                "functions": functions,
                "variables": variables,
                "classes": classes,
                "modules": modules,
                "constants": constants
            }
        }
    
    def extract_all(self) -> List[Dict]:
        cobol_files = self.find_cobol_files()
        print(f"Found {len(cobol_files)} COBOL files")
        
        for cobol_file in cobol_files:
            print(f"Processing {cobol_file.name}...")
            entities = self.extract_file_entities(cobol_file)
            if entities:
                self.entities_by_file.append(entities)
        
        return self.entities_by_file
    
    def save_to_json(self, output_path: str):
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.entities_by_file, f, indent=2)
        
        print(f"\nEntities saved to {output_path}")
        print(f"Total files processed: {len(self.entities_by_file)}")
        
        total_functions = sum(len(f["entities"]["functions"]) for f in self.entities_by_file)
        total_variables = sum(len(f["entities"]["variables"]) for f in self.entities_by_file)
        total_constants = sum(len(f["entities"]["constants"]) for f in self.entities_by_file)
        total_modules = sum(len(f["entities"]["modules"]) for f in self.entities_by_file)
        total_classes = sum(len(f["entities"]["classes"]) for f in self.entities_by_file)
        
        print(f"\nEntity Summary:")
        print(f"  Functions/Paragraphs: {total_functions}")
        print(f"  Variables: {total_variables}")
        print(f"  Constants: {total_constants}")
        print(f"  Modules: {total_modules}")
        print(f"  Classes/Structs: {total_classes}")

def main():
    repo_path = "/home/ubuntu/repos/n8n-tryout"
    output_path = "/home/ubuntu/repos/n8n-tryout/extracted_data/entities.json"
    
    extractor = CobolEntityExtractor(repo_path)
    extractor.extract_all()
    extractor.save_to_json(output_path)

if __name__ == "__main__":
    main()
