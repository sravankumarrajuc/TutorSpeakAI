# TODO: Change Enterprise Free to Enterprise Custom

## Plan Approved
- [x] Analyze current pricing display logic
- [x] Identify the formatPrice function in PricingSection.tsx
- [x] Confirm plan with user

## Implementation Steps
- [x] Modify formatPrice function in PricingSection.tsx to show "Custom" for Enterprise plan
- [x] Test the change to ensure Enterprise shows "Custom" while Free plan still shows "Free"
- [x] Verify no other pricing displays are affected

## Files to Edit
- [x] `frontend/src/components/landing/PricingSection.tsx` - Update formatPrice function

## Expected Result
- [x] Enterprise plan will display "Custom" instead of "Free"
- [x] Free plan will continue to display "Free"
- [x] All other plans remain unchanged

## Implementation Summary
Successfully updated the `formatPrice` function in `PricingSection.tsx` to:
- Check if the plan ID is 'enterprise' when price is 0
- Return "Custom" for Enterprise plan
- Return "Free" for the actual free plan
- Keep existing logic for all other plans with actual prices

The change is minimal and targeted, ensuring no other functionality is affected.
