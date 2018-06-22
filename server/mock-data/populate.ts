import { MockDataClientService } from './mock-data-client.service';
import { MockDataService } from './mock-data.service';

async function populate() {
    const mockDataService = new MockDataService();
    const mockDataClientService = new MockDataClientService();

    await mockDataService.connect();
    await mockDataService.clearAllTables();
    await mockDataClientService.populateOptions();
    await mockDataClientService.populateProducts(200);
    await mockDataClientService.populateCustomers(100);
    await mockDataClientService.populateAdmins();
}

// tslint:disable:no-floating-promises
populate().then(() => process.exit(0));