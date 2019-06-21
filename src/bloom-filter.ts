import BaseFilter from './base-filter'

/**
 * Bloom filter
 */
export default class BloomFilter extends BaseFilter {
  /**
   * Reserve space for the filter
   */
  public async reserve(): Promise<void> {
    try {
      await this.client.call(
        'BF.RESERVE',
        this.name,
        this.options.errorRate,
        this.options.minCapacity
      )
    } catch (err) {
      if (err.message === 'ERR item exists') return // ignore the error if the filter is already created
      throw err
    }
  }

  /**
   * Add an item to the filter
   * @param item Item
   * @return Promise that resolves to 1 if item was newly added, 0 if it may have previously existed
   */
  public async add(item: any): Promise<number> {
    return this.client.call('BF.ADD', this.name, item)
  }

  /**
   * Add some items to the filter
   * @param items Items
   * @return Promise that resolves to an array of integers. Each is either 1 or 0
   */
  public async addMany(...items: any[]): Promise<number[]> {
    return this.client.call('BF.MADD', this.name, ...items)
  }

  /**
   * Check if an item already exists in the filter
   * @param item Item
   * @return Promise that resolves to 0 if item certainly does not exist, 1 if item may exist
   */
  public async exists(item: any): Promise<number> {
    return this.client.call('BF.EXISTS', this.name, item)
  }

  /**
   * Check if some items already exist in the filter
   * @param items Items
   * @return Promise that resolves to an array of integers. Each is either 1 or 0
   */
  public async existsMany(...items: any[]): Promise<number[]> {
    return this.client.call('BF.MEXISTS', this.name, ...items)
  }
}