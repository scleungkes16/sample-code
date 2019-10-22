import { McoinCustomerPortalPage } from './app.po';

describe('mcoin-customer-portal App', () => {
  let page: McoinCustomerPortalPage;

  beforeEach(() => {
    page = new McoinCustomerPortalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
