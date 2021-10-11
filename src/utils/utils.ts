/**
 * 根据lookup的key获取value
 * @template T
 * @param {T} key
 * @param {IStatusEnum[]} list
 * @return {*}  {(IStatusEnum['title'] | undefined)}
 */
export const getLookupNameByKey = <T extends IStatusEnum['value'] | undefined>(
  key: T,
  list: IStatusEnum[]
): IStatusEnum['title'] | undefined =>
  list.find(item => item.value === key)?.title
