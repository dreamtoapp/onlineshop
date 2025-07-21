# 📋 Policy Management Action Plan
## Website Policies & Return Policies Implementation Strategy

### 🎯 **Current Situation Analysis**

#### Existing Term Model Structure:
```prisma
model Term {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  content   String   @default("")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  translations TermTranslation[] // Multi-language support
}

model TermTranslation {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  termId         String   @db.ObjectId
  term           Term     @relation(fields: [termId], references: [id], onDelete: Cascade)
  languageCode   String   // e.g., "en", "ar-SA"
  content        String   // Translated term content
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  @@unique([termId, languageCode])
}
```

#### Current Usage Analysis:

**1. Existing Implementation:**
- **Location**: `/app/dashboard/management/rulesandcondtions/` ✅ **MOVED**
- **Purpose**: Generic "Terms & Conditions" management
- **Current Functionality**: 
  - Basic CRUD operations (Create, Read, Update, Delete)
  - Simple table-based interface
  - No policy type differentiation
  - No version control
  - No active/inactive status

**2. Current Actions (`terms-actions.ts`):**
```typescript
export async function getTerms(): Promise<Term[]>
export async function createTerm(content: string): Promise<Term>
export async function updateTerm(id: string, content: string): Promise<Term>
export async function deleteTerm(id: string): Promise<Term>
```

**3. Current UI (`page.tsx`):**
- Simple form for adding/editing terms
- Table display of all terms
- Basic edit/delete functionality
- No policy categorization
- No rich text editing

**4. Database Usage:**
- Currently stores generic terms content
- No policy type field
- No title field
- No active status
- No version tracking
- Translation support exists but not utilized in current UI

**5. Improved Folder Structure:**
- ✅ **Moved to Management**: `/app/dashboard/management/rulesandcondtions/`
- ✅ **Better Organization**: Now properly organized under management section
- ✅ **Consistent Structure**: Follows the same pattern as other management modules
- ✅ **Future-Ready**: Ready for integration with new policy management system

### 🤔 **Key Questions to Consider**

1. **Content Management**: How often do policies change?
2. **User Access**: Who needs to edit these policies?
3. **Versioning**: Do we need policy version history?
4. **Compliance**: Are there legal requirements for policy display?
5. **Localization**: How many languages do we support?

---

## 🎯 **RECOMMENDATION: Enhanced Single Table Approach**

### **Option 1: Enhanced Term Model (RECOMMENDED)**

#### **Pros:**
- ✅ **Unified Management**: Single interface for all policies
- ✅ **Consistent UX**: Same editing experience across policies
- ✅ **Multi-language**: Built-in translation support
- ✅ **Simpler Codebase**: Less complexity in management
- ✅ **Scalable**: Easy to add new policy types

#### **Cons:**
- ❌ **Less Specific**: Generic structure for all policies
- ❌ **Limited Validation**: No policy-specific validation

#### **Implementation:**
```prisma
model Term {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  type        TermType @default(WEBSITE_POLICY) // NEW: Policy type enum
  title       String   @default("") // NEW: Policy title
  content     String   @default("")
  isActive    Boolean  @default(true) // NEW: Enable/disable policies
  version     Int      @default(1) // NEW: Version tracking
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  translations TermTranslation[]
  
  @@unique([type, languageCode]) // Ensure one active policy per type per language
}

enum TermType {
  WEBSITE_POLICY    // سياسة الموقع
  RETURN_POLICY     // سياسة الإرجاع
  PRIVACY_POLICY    // سياسة الخصوصية
  TERMS_OF_SERVICE  // شروط الخدمة
  SHIPPING_POLICY   // سياسة الشحن
  WARRANTY_POLICY   // سياسة الضمان
}
```

---

## 🎯 **ALTERNATIVE: Separate Tables Approach**

### **Option 2: Dedicated Policy Models**

#### **Pros:**
- ✅ **Specific Validation**: Each policy can have custom fields
- ✅ **Type Safety**: Strong typing for each policy type
- ✅ **Custom Logic**: Policy-specific business rules
- ✅ **Independent Updates**: Policies can evolve separately

#### **Cons:**
- ❌ **Code Duplication**: Similar CRUD operations for each policy
- ❌ **Complex Management**: Multiple interfaces to maintain
- ❌ **Inconsistent UX**: Different editing experiences

#### **Implementation:**
```prisma
model WebsitePolicy {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String   @default("")
  content     String   @default("")
  isActive    Boolean  @default(true)
  version     Int      @default(1)
  lastUpdated DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  translations WebsitePolicyTranslation[]
}

model ReturnPolicy {
  id                    String   @id @default(auto()) @map("_id") @db.ObjectId
  title                 String   @default("")
  content               String   @default("")
  returnPeriodDays      Int      @default(14) // Specific to returns
  refundMethod          String   @default("original_payment") // Specific field
  isActive              Boolean  @default(true)
  version               Int      @default(1)
  lastUpdated           DateTime @default(now())
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  translations          ReturnPolicyTranslation[]
}
```

---

## 🎯 **HYBRID APPROACH: Best of Both Worlds**

### **Option 3: Enhanced Term + Policy Extensions**

#### **Implementation:**
```prisma
model Term {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  type        TermType @default(WEBSITE_POLICY)
  title       String   @default("")
  content     String   @default("")
  isActive    Boolean  @default(true)
  version     Int      @default(1)
  metadata    Json?    // NEW: Store policy-specific data
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  translations TermTranslation[]
  
  @@unique([type, languageCode])
}

// Example metadata for ReturnPolicy:
// {
//   "returnPeriodDays": 14,
//   "refundMethod": "original_payment",
//   "excludedItems": ["electronics", "perishables"],
//   "restockingFee": 10
// }
```

---

## 🚀 **RECOMMENDED IMPLEMENTATION PLAN**

### **Phase 1: Enhanced Term Model (Week 1-2)**

1. **Database Schema Update**:
   ```bash
   # Add new fields to Term model
   - type: TermType enum
   - title: String
   - isActive: Boolean
   - version: Int
   - metadata: Json (optional)
   ```

2. **Migration Strategy**:
   ```sql
   -- Existing data migration
   -- Convert current generic terms to WEBSITE_POLICY type
   UPDATE Term SET 
     type = 'WEBSITE_POLICY',
     title = 'Terms & Conditions',
     isActive = true,
     version = 1
   WHERE type IS NULL;
   ```

3. **Backward Compatibility**:
   - Keep existing `/dashboard/management/rulesandcondtions/` route functional ✅ **UPDATED PATH**
   - Gradually migrate to new policy management system
   - Maintain existing API endpoints during transition

2. **Backend Implementation**:
   ```typescript
   // actions/policyManagement.ts
   export async function createPolicy(data: CreatePolicyData)
   export async function updatePolicy(id: string, data: UpdatePolicyData)
   export async function getActivePolicy(type: TermType, locale: string)
   export async function getPolicyHistory(type: TermType)
   ```

3. **Frontend Management Interface**:
   ```
   /dashboard/management/policies/
   ├── website-policy/
   ├── return-policy/
   ├── privacy-policy/
   └── terms-of-service/
   ```

### **Phase 2: Policy Management UI (Week 3-4)**

1. **Policy Editor Component**:
   - Rich text editor (TinyMCE or similar)
   - Version history viewer
   - Preview mode
   - Publish/draft functionality

2. **Policy Display Components**:
   - Public policy pages
   - Footer links
   - Checkout policy acceptance
   - Mobile-responsive design

### **Phase 3: Advanced Features (Week 5-6)**

1. **Version Control**:
   - Policy change tracking
   - Rollback functionality
   - Change notifications

2. **Compliance Features**:
   - Policy acceptance tracking
   - Legal compliance checks
   - Audit trail

---

## 📋 **IMMEDIATE ACTION ITEMS**

### **1. Database Migration**
```sql
-- Add new fields to existing Term model
ALTER TABLE Term ADD COLUMN type VARCHAR(50) DEFAULT 'WEBSITE_POLICY';
ALTER TABLE Term ADD COLUMN title VARCHAR(255) DEFAULT '';
ALTER TABLE Term ADD COLUMN isActive BOOLEAN DEFAULT true;
ALTER TABLE Term ADD COLUMN version INT DEFAULT 1;
ALTER TABLE Term ADD COLUMN metadata JSON;

-- Migrate existing data
UPDATE Term SET 
  type = 'WEBSITE_POLICY',
  title = 'Terms & Conditions',
  isActive = true,
  version = 1
WHERE type IS NULL;
```

### **2. Update Existing Terms Page**
- Enhance `/dashboard/rulesandcondtions/` to support policy types
- Add policy type selector dropdown
- Show active/inactive status
- Display version information
- Improve editing interface

### **2. Create Policy Management Actions**
```typescript
// app/dashboard/management/policies/actions/
├── createPolicy.ts
├── updatePolicy.ts
├── getPolicy.ts
├── getPolicyHistory.ts
├── publishPolicy.ts
└── migrateExistingTerms.ts // NEW: Migration helper
```

### **3. Update Existing Terms Actions**
```typescript
// app/dashboard/rulesandcondtions/actions/terms-actions.ts
// Add backward compatibility methods:
export async function getTermsByType(type: TermType): Promise<Term[]>
export async function getActivePolicy(type: TermType): Promise<Term | null>
```

### **3. Update Existing Terms Actions**
```typescript
// app/dashboard/rulesandcondtions/actions/terms-actions.ts
// Add backward compatibility methods:
export async function getTermsByType(type: TermType): Promise<Term[]>
export async function getActivePolicy(type: TermType): Promise<Term | null>
```

### **4. Create Policy Management Pages**
```typescript
// app/dashboard/management/policies/
├── page.tsx (Policy overview)
├── website-policy/
│   └── page.tsx
├── return-policy/
│   └── page.tsx
├── privacy-policy/
│   └── page.tsx
└── terms-of-service/
    └── page.tsx
```

### **5. Update Existing Terms Page**
```typescript
// app/dashboard/management/rulesandcondtions/page.tsx ✅ **UPDATED PATH**
// Enhance existing page to:
// - Show policy type selector
// - Display active/inactive status
// - Add version information
// - Improve UI with better editing experience
```

### **6. Create Policy Display Components**
```typescript
// components/policies/
├── PolicyViewer.tsx
├── PolicyAcceptance.tsx
├── PolicyLinks.tsx
└── PolicyBanner.tsx
```

---

## 🎯 **FINAL RECOMMENDATION**

### **Use Enhanced Term Model (Option 1)**

**Why This Approach:**
1. **Simplicity**: Single table, unified management
2. **Scalability**: Easy to add new policy types
3. **Consistency**: Same UX across all policies
4. **Multi-language**: Built-in translation support
5. **Maintainability**: Less code to maintain

**Implementation Priority:**
1. ✅ **Week 1**: Database schema update
2. ✅ **Week 2**: Backend actions and API
3. ✅ **Week 3**: Management interface
4. ✅ **Week 4**: Public display components
5. ✅ **Week 5**: Advanced features (versioning, compliance)

**Success Metrics:**
- 📊 **Policy Update Time**: < 5 minutes
- 📊 **User Acceptance Rate**: > 95%
- 📊 **Translation Coverage**: 100% (Arabic + English)
- 📊 **Compliance Score**: 100%

---

## 🤝 **Next Steps**

1. **Review this plan** with stakeholders
2. **Choose implementation approach** (Recommended: Enhanced Term Model)
3. **Set up development timeline** (6 weeks total)
4. **Create detailed technical specifications**
5. **Begin Phase 1 implementation**

**Questions for Discussion:**
- Do you agree with the Enhanced Term Model approach?
- What specific policy types do you need beyond website and return policies?
- Do you need version control and audit trails?
- What languages do you need to support?
- Any specific compliance requirements?

---

*This plan provides a solid foundation for scalable policy management while maintaining simplicity and user experience.* 