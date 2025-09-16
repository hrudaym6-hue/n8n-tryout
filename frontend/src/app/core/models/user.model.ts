import { Account } from './account.model';\nexport interface User {\n  id?: number;\n  name: string;\n  email: string;\n  accounts?: Account[];\n}
