
import ClientsAxios from '../client-axios';
import { handleGetRequest, handlePostRequest } from './requestHandler';
import { PublicLabelResponse } from '../dto/response/label';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;


export const GuestProductDetailsService = (payload: any) => handlePostRequest<any>(`v1/public-qr`, payload, CMRF_NGO_ADMIN_SERVER);

export const FetchPublicProductLabelService = (code: string) => handleGetRequest<PublicLabelResponse>(`v1/public/product-label/${code}`, {}, CMRF_NGO_ADMIN_SERVER);