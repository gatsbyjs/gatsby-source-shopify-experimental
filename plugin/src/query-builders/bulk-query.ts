export abstract class BulkQuery {
  pluginOptions: ShopifyPluginOptions;

  constructor(pluginOptions: ShopifyPluginOptions) {
    this.pluginOptions = pluginOptions;
  }

  get canReadPublications() {
    const scopes = this.pluginOptions.privilegedAccessScopes || [];
    return scopes.includes("read_publications");
  }

  abstract query(date?: Date): string;

  protected conditionalField(field: string, condition: boolean) {
    return condition ? field : `# omitted field: ${field}`;
  }

  protected bulkOperationQuery(query: string) {
    return `
      mutation INITIATE_BULK_OPERATION {
        bulkOperationRunQuery(
        query: """
          ${query}
        """
      ) {
        bulkOperation {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
    `;
  }
}
