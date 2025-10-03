#!/usr/bin/env python3
import re
import json
import os
from pathlib import Path
from typing import List, Dict, Any

def find_cobol_files(root_dir: str) -> List[str]:
    cobol_files = []
    for pattern in ['**/*.cbl', '**/*.CBL']:
        cobol_files.extend(Path(root_dir).glob(pattern))
    return sorted([str(f) for f in cobol_files])

def extract_procedure_division(content: str) -> tuple:
    lines = content.split('\n')
    proc_start = -1
    
    for i, line in enumerate(lines):
        if 'PROCEDURE DIVISION' in line.upper():
            proc_start = i
            break
    
    if proc_start == -1:
        return [], 0
    
    return lines[proc_start:], proc_start

def get_current_paragraph(lines: List[str], current_line: int) -> str:
    for i in range(current_line, -1, -1):
        line = lines[i].strip()
        if line and not line.startswith('*') and line.endswith('.'):
            tokens = line.split()
            if len(tokens) > 0:
                first_word = tokens[0].upper()
                keywords = {'MOVE', 'IF', 'COMPUTE', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 
                           'PERFORM', 'EXEC', 'END-EXEC', 'EVALUATE', 'WHEN', 'END-EVALUATE',
                           'DISPLAY', 'ACCEPT', 'OPEN', 'CLOSE', 'READ', 'WRITE', 'SET',
                           'CONTINUE', 'EXIT', 'GOBACK', 'STOP', 'INITIALIZE', 'STRING', 'CALL'}
                if first_word not in keywords and '-' in first_word:
                    return line.strip().rstrip('.')
    return "MAIN-PROCEDURE"

def extract_variables(text: str) -> List[str]:
    variables = []
    var_pattern = r'\b[A-Z][A-Z0-9\-]+\b'
    matches = re.findall(var_pattern, text)
    
    keywords = {'MOVE', 'TO', 'FROM', 'COMPUTE', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'IF', 
               'THEN', 'ELSE', 'END-IF', 'PERFORM', 'THRU', 'UNTIL', 'VARYING', 'BY', 'WHEN', 
               'EVALUATE', 'END-EVALUATE', 'TRUE', 'FALSE', 'NOT', 'AND', 'OR', 'EQUAL', 'GREATER', 
               'LESS', 'THAN', 'DISPLAY', 'ACCEPT', 'OPEN', 'CLOSE', 'READ', 'WRITE', 'REWRITE', 
               'DELETE', 'START', 'DFHRESP', 'NORMAL', 'NOTFND', 'EXEC', 'CICS', 'END-EXEC', 'DLI', 
               'DATASET', 'INTO', 'LENGTH', 'OF', 'RIDFLD', 'KEYLENGTH', 'RESP', 'RESP2', 'UPDATE', 
               'SET', 'CONTINUE', 'EXIT', 'GOBACK', 'STOP', 'RUN', 'INITIALIZE', 'INSPECT', 'STRING', 
               'UNSTRING', 'CALL', 'USING', 'GIVING', 'RETURNING', 'SIZE', 'ALL', 'LEADING', 
               'TRAILING', 'REPLACING', 'DELIMITED', 'POINTER', 'TALLYING', 'VALUE', 'VALUES', 
               'OCCURS', 'TIMES', 'DEPENDING', 'ON', 'INDEXED', 'ASCENDING', 'DESCENDING', 'KEY', 
               'IS', 'ARE', 'WITH', 'NO', 'ADVANCING', 'INVALID', 'AT', 'END', 'SEGMENT', 'WHERE', 
               'GU', 'PCB', 'STATUS-OK', 'SEGMENT-NOT-FOUND', 'OTHER', 'FUNCTION', 'CURRENT-DATE', 
               'NUMVAL', 'SPACES', 'ZEROS', 'ZERO', 'ZEROES', 'HIGH-VALUES', 'LOW-VALUES', 'QUOTES',
               'SPACE', 'COMP', 'COMP-3', 'PIC', 'PICTURE', 'BINARY', 'PACKED-DECIMAL'}
    
    for match in matches:
        if match not in keywords and match not in variables:
            variables.append(match)
    
    return variables

def extract_domain_concepts(variables: List[str], description: str) -> List[str]:
    concepts = set()
    
    concept_map = {
        'CREDIT': 'credit limit',
        'LIMIT': 'limit',
        'BALANCE': 'account balance',
        'BAL': 'balance',
        'AUTH': 'authorization',
        'TRAN': 'transaction',
        'ACCT': 'account',
        'CUST': 'customer',
        'CARD': 'card',
        'AMT': 'amount',
        'AMOUNT': 'amount',
        'STATUS': 'status',
        'FRAUD': 'fraud',
        'RESP': 'response',
        'DECLINE': 'decline',
        'APPROVE': 'approval',
        'AVAILABLE': 'available credit',
        'MERCHANT': 'merchant',
        'PAYMENT': 'payment',
        'BILL': 'billing',
        'INTEREST': 'interest',
        'FEE': 'fee',
        'RATE': 'rate',
        'DATE': 'date',
        'TIME': 'time'
    }
    
    for var in variables:
        for pattern, concept in concept_map.items():
            if pattern in var.upper():
                concepts.add(concept)
    
    desc_lower = description.lower()
    for pattern, concept in concept_map.items():
        if pattern.lower() in desc_lower or concept in desc_lower:
            concepts.add(concept)
    
    return sorted(list(concepts))

def parse_business_rules(file_path: str, content: str) -> List[Dict[str, Any]]:
    rules = []
    proc_lines, proc_offset = extract_procedure_division(content)
    
    if not proc_lines:
        return rules
    
    i = 0
    
    while i < len(proc_lines):
        line = proc_lines[i]
        line_stripped = line.strip()
        actual_line_no = proc_offset + i + 1
        
        if not line_stripped or line_stripped.startswith('*'):
            i += 1
            continue
        
        if 'COMPUTE' in line_stripped.upper():
            full_statement = line_stripped
            j = i + 1
            while j < len(proc_lines):
                next_line = proc_lines[j].strip()
                if next_line and not next_line.startswith('*'):
                    full_statement += ' ' + next_line
                    if next_line.endswith('.'):
                        break
                j += 1
                if j - i > 10:
                    break
            
            match = re.search(r'COMPUTE\s+([A-Z0-9\-]+)\s*=\s*(.+?)(?:\.|$)', full_statement, re.IGNORECASE)
            if match:
                target_var = match.group(1)
                expression = match.group(2).strip().rstrip('.')
                
                variables = extract_variables(full_statement)
                paragraph = get_current_paragraph(proc_lines, i)
                
                condition = ""
                for k in range(i-1, max(0, i-10), -1):
                    prev_line = proc_lines[k].strip()
                    if prev_line.upper().startswith('IF '):
                        condition = prev_line
                        break
                    elif prev_line.endswith('.'):
                        break
                
                description = f"Calculate {target_var.lower().replace('-', ' ')} by evaluating: {expression}"
                outcome = f"{target_var} is set to the computed value"
                
                rule = {
                    "description": description,
                    "type": "calculation",
                    "condition": condition,
                    "outcome": outcome,
                    "location": {
                        "function": paragraph,
                        "line": actual_line_no
                    },
                    "variablesInvolved": variables,
                    "isConfigurable": True,
                    "relatedDomainConcepts": extract_domain_concepts(variables, description)
                }
                rules.append(rule)
            
            i = j
            continue
        
        arithmetic_ops = ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']
        handled = False
        for op in arithmetic_ops:
            if line_stripped.upper().startswith(op + ' '):
                full_statement = line_stripped
                j = i + 1
                while j < len(proc_lines):
                    next_line = proc_lines[j].strip()
                    if next_line and not next_line.startswith('*'):
                        full_statement += ' ' + next_line
                        if next_line.endswith('.'):
                            break
                    j += 1
                    if j - i > 10:
                        break
                
                if ' TO ' in full_statement.upper() or ' FROM ' in full_statement.upper() or ' GIVING ' in full_statement.upper():
                    variables = extract_variables(full_statement)
                    paragraph = get_current_paragraph(proc_lines, i)
                    
                    condition = ""
                    for k in range(i-1, max(0, i-10), -1):
                        prev_line = proc_lines[k].strip()
                        if prev_line.upper().startswith('IF '):
                            condition = prev_line
                            break
                        elif prev_line.endswith('.'):
                            break
                    
                    description = f"Perform {op.lower()} operation: {full_statement[:80]}"
                    outcome = f"Result of {op.lower()} operation is applied"
                    
                    rule = {
                        "description": description,
                        "type": "calculation",
                        "condition": condition,
                        "outcome": outcome,
                        "location": {
                            "function": paragraph,
                            "line": actual_line_no
                        },
                        "variablesInvolved": variables,
                        "isConfigurable": True,
                        "relatedDomainConcepts": extract_domain_concepts(variables, description)
                    }
                    rules.append(rule)
                
                i = j
                handled = True
                break
        
        if handled:
            continue
        
        if line_stripped.upper().startswith('IF '):
            full_condition = line_stripped
            j = i + 1
            depth = 0
            while j < len(proc_lines):
                next_line = proc_lines[j].strip()
                if not next_line or next_line.startswith('*'):
                    j += 1
                    continue
                if next_line.upper().startswith(('MOVE', 'SET', 'PERFORM', 'COMPUTE', 'ADD')):
                    break
                full_condition += ' ' + next_line
                j += 1
                if j - i > 5:
                    break
            
            business_keywords = ['>', '<', '=', 'GREATER', 'LESS', 'EQUAL', 'NOT', 'FOUND', 
                               'LIMIT', 'BALANCE', 'AMOUNT', 'STATUS', 'NFOUND', 'VALID']
            if any(keyword in full_condition.upper() for keyword in business_keywords):
                variables = extract_variables(full_condition)
                paragraph = get_current_paragraph(proc_lines, i)
                
                description = f"Validate business condition: {full_condition[:80]}"
                outcome = "Conditional execution path based on validation result"
                
                rule = {
                    "description": description,
                    "type": "validation",
                    "condition": full_condition,
                    "outcome": outcome,
                    "location": {
                        "function": paragraph,
                        "line": actual_line_no
                    },
                    "variablesInvolved": variables,
                    "isConfigurable": True,
                    "relatedDomainConcepts": extract_domain_concepts(variables, description)
                }
                rules.append(rule)
        
        if 'MOVE' in line_stripped.upper() and 'TO' in line_stripped.upper():
            literal_move = re.search(r"MOVE\s+'[^']*'\s+TO", line_stripped, re.IGNORECASE) or \
                          re.search(r"MOVE\s+\d+\s+TO", line_stripped, re.IGNORECASE) or \
                          re.search(r'MOVE\s+"[^"]*"\s+TO', line_stripped, re.IGNORECASE)
            
            if literal_move:
                in_conditional = False
                condition = ""
                for k in range(i-1, max(0, i-15), -1):
                    prev_line = proc_lines[k].strip()
                    if prev_line.upper().startswith('IF ') or prev_line.upper().startswith('WHEN '):
                        in_conditional = True
                        condition = prev_line
                        break
                    elif prev_line.endswith('.') and not prev_line.upper().startswith('END-'):
                        break
                
                if in_conditional:
                    variables = extract_variables(line_stripped)
                    paragraph = get_current_paragraph(proc_lines, i)
                    
                    match = re.search(r"MOVE\s+(.+?)\s+TO\s+(.+?)(?:\.|$)", line_stripped, re.IGNORECASE)
                    if match:
                        source = match.group(1).strip()
                        target = match.group(2).strip()
                        
                        is_literal = source.startswith("'") or source.startswith('"') or source.isdigit()
                        
                        description = f"Assign value {source} to {target.lower().replace('-', ' ')}"
                        outcome = f"{target} is set to {source}"
                        
                        rule = {
                            "description": description,
                            "type": "assignment",
                            "condition": condition,
                            "outcome": outcome,
                            "location": {
                                "function": paragraph,
                                "line": actual_line_no
                            },
                            "variablesInvolved": variables,
                            "isConfigurable": not is_literal,
                            "relatedDomainConcepts": extract_domain_concepts(variables, description)
                        }
                        rules.append(rule)
        
        if line_stripped.upper().startswith('EVALUATE '):
            evaluate_var = line_stripped.split()[1] if len(line_stripped.split()) > 1 else ""
            j = i + 1
            while j < len(proc_lines):
                eval_line = proc_lines[j].strip()
                if eval_line.upper().startswith('WHEN '):
                    condition = f"EVALUATE {evaluate_var} {eval_line}"
                    variables = extract_variables(condition)
                    paragraph = get_current_paragraph(proc_lines, i)
                    
                    description = f"Evaluate condition branch: {condition[:80]}"
                    outcome = "Execute corresponding WHEN clause actions"
                    
                    rule = {
                        "description": description,
                        "type": "validation",
                        "condition": condition,
                        "outcome": outcome,
                        "location": {
                            "function": paragraph,
                            "line": proc_offset + j + 1
                        },
                        "variablesInvolved": variables,
                        "isConfigurable": True,
                        "relatedDomainConcepts": extract_domain_concepts(variables, description)
                    }
                    rules.append(rule)
                
                j += 1
                if eval_line.upper().startswith('END-EVALUATE'):
                    break
            
            i = j
            continue
        
        i += 1
    
    return rules

def main():
    repo_root = '/home/ubuntu/repos/n8n-tryout'
    
    cobol_files = find_cobol_files(repo_root)
    
    all_rules = []
    
    for file_path in cobol_files:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            rules = parse_business_rules(file_path, content)
            
            if rules:
                rel_path = os.path.relpath(file_path, repo_root)
                
                all_rules.append({
                    "file": rel_path,
                    "rules": rules
                })
        except Exception:
            pass
    
    print(json.dumps(all_rules, indent=2))

if __name__ == '__main__':
    main()
