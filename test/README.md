# Unit Tests

Critical tests for Master Service feature. Tests focus on **logic layer only** (services, hooks, validation), not UI rendering.

## Test Structure

```
test/
├── setup.ts                              # Global test setup
├── services/
│   └── master-service.test.ts            # API functions tests
└── modules/
    └── master-service/
        ├── form-validation.test.ts       # Form validation logic
        └── filter-logic.test.ts          # Filter/search logic
```

## What's Tested (Critical Path Only)

### Services (`test/services/master-service.test.ts`)
- ✅ Fetching branches
- ✅ Fetching services (all + filtered by branch)
- ✅ Creating services
- ✅ Updating services
- ✅ Deleting services
- ✅ Data structure validation

### Form Validation (`test/modules/master-service/form-validation.test.ts`)
- ✅ Required field validation
- ✅ Empty/whitespace detection
- ✅ All fields validated
- ✅ Error messages

### Filter Logic (`test/modules/master-service/filter-logic.test.ts`)
- ✅ Filter by single criterion
- ✅ Filter by multiple criteria (AND logic)
- ✅ Case-insensitive matching
- ✅ Partial string matching
- ✅ Empty results handling

## What's NOT Tested (Deferred)

❌ Component rendering (React components)
❌ UI interactions (clicks, forms)
❌ CSS/styling
❌ Integration tests (UI + API together)
❌ E2E tests

These are better tested manually or with E2E tools (Playwright, Cypress).

## Run Tests

```bash
# Run tests in watch mode (recommended for development)
npm run test

# Run tests once (CI/CD pipeline)
npm run test:run

# Generate coverage report
npm run test:coverage
```

## Test Tools

- **Vitest**: Fast unit test framework
- **Happy-DOM**: Lightweight DOM for testing (no browser needed)
- **TypeScript**: Type-safe tests

## Test Naming Convention

Tests follow this pattern:
- **Describe blocks**: `describe('Feature Name', ...)`
- **Test cases**: `it('should [expected behavior]', ...)`
- **Assertions**: `expect(value).toEqual(...)`

Example:
```typescript
describe('fetchServices', () => {
  it('should return services for specific branch', () => {
    const result = fetchServices('1')
    expect(result.every(s => s.branchId === '1')).toBe(true)
  })
})
```

## Adding More Tests

When adding new features:

1. **Service functions** → Add test in `test/services/`
2. **Form logic** → Add test in `test/modules/<feature>/form-*.test.ts`
3. **Filter/search** → Add test in `test/modules/<feature>/filter-*.test.ts`
4. **Hooks** → Add test in `test/modules/<feature>/hooks-*.test.ts` (future)

Never test:
- Component rendering
- CSS/styling
- Button clicks
- DOM manipulation

Test instead:
- Logic functions
- Data transformations
- Validation rules
- API responses

## Tips

- Tests should be fast (< 100ms each)
- Mock external APIs (don't call real APIs)
- Use meaningful test descriptions
- One assertion per test (ideally)
- Test happy path + error cases
