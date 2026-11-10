import { Then } from '@wdio/cucumber-framework'

Then(/^the user should see claim amount$/, async function () {
  const totalClaimText = await $('p.govuk-inset-text')

  const actualText = await totalClaimText.getText()

  await expect(actualText).toContain('Total claim amount:')
  await expect(actualText).toContain('£3,075.00')
})
