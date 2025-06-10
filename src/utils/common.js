import { toast } from 'react-toastify';

export async function handleApiResponse(response, method = '') {
 

  switch (response?.data?.status) {
    case 200:
      if (method === 'UPDATE' || method === 'DELETE') {
        toast.success(response?.data?.message || 'Data Updated Successfully');
      }
      return response.data;

    case 201:
      toast.success(response?.data?.message || 'Data Added Successfully');
      return response.data;

    case 404:
    case 409:
    case 422:
    case 400:
      toast.info(response?.data?.message);
      return response;

    case 401:
      toast.info(response?.data?.message || 'Unauthorized');
      return response;

    case 500:
      toast.error(response?.data?.message || 'Something went wrong');
      return response;

    default:
      return response;
  }
}
