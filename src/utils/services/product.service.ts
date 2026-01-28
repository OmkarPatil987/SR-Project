
import ClientsAxios from '../client-axios';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;


export const FetchProductListService = (payload: any) => handlePostRequest<any>('v1/product/list', payload, CMRF_NGO_ADMIN_SERVER);

//StoreProductService
export const StoreProductService = (payload: any) => handlePostRequest<any>('v1/product/create', payload, CMRF_NGO_ADMIN_SERVER);

export const UpdateProductService = (payload: any) => handlePostRequest<any>('v1/product/update', payload, CMRF_NGO_ADMIN_SERVER);

export const DeleteProductService = (payload: any) => handlePostRequest<any>('v1/product/delete', payload, CMRF_NGO_ADMIN_SERVER);

//details
export const FetchProductDetailsService = (payload: any) => handlePostRequest<any>('v1/product-details', payload, CMRF_NGO_ADMIN_SERVER);

//getCompanyList
export const FetchCompanyListService = (payload: any) => handlePostRequest<any>('v1/companies/list', payload, CMRF_NGO_ADMIN_SERVER);

//CommonDeleteService
export const CommonDeleteService = (url: string, payload: any) => handlePostRequest<any>(`v1/${url}`, payload, CMRF_NGO_ADMIN_SERVER);