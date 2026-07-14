import ClientsAxios from '../client-axios';
import { handleGetRequest, handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const FetchProductGazetteListService = (params: { limit: number; offset: number; query?: string }) =>
    handleGetRequest<any>('v1/products-gazette-list', params, CMRF_NGO_ADMIN_SERVER);

export const FetchProductGazetteByIdsService = (payload: { ids: number[] }) =>
    handlePostRequest<any>('v1/products-gazette-by-ids', payload, CMRF_NGO_ADMIN_SERVER);

export const GenerateLabelPdfService = (payload: any) =>
    handlePostRequest<any>('v1/products-gazette/label-pdf', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchLabelPdfHistoryService = (params: { limit: number; offset: number; query?: string }) =>
    handleGetRequest<any>('v1/products-gazette/label-pdf-list', params, CMRF_NGO_ADMIN_SERVER);
