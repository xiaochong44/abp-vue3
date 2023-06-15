import { request } from '../request';

/**
 * 获取数据字典
 * @param page - 分页信息
 * @returns - 返回分页结果
 */
export function fetchDataDictionaries(page: System.GetDataDictionariesInput) {
  return request.get<Common.PagedResult<System.DataDictionary>>('/api/app/data-dictionary', { params: page });
}

/**
 * 更新数据字典
 * @param id - 数据字典Id
 * @param role - 数据字典
 * @returns - 数据字典
 */
export function fetchUpdateDataDictionary(id: string, data: System.DataDictionaryUpdate) {
  return request.put(`/api/app/data-dictionary/${id}`, data);
}
/**
 * 创建数据字典
 * @param role - 数据字典
 * @returns - 数据字典
 */
export function fetchCreateDataDictionary(data: System.DataDictionaryCreate) {
  return request.post(`/api/app/data-dictionary`, data);
}
/**
 * 删除数据字典
 * @param id - 数据字典id
 */
export function fetchDeleteDataDictionary(id: string) {
  return request.delete(`/api/app/data-dictionary/${id}`);
}
