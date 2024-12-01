export class Constants {
  //static readonly API_URL_V1_PREFIX = "http://localhost:8888/api/v1";
  //static readonly API_URL_V1_PREFIX = "https://shop-reservation-api-c5gnapbkcbg7fugn.centralus-01.azurewebsites.net/api/v1";
  static readonly API_URL_V1_PREFIX = "https://nail-shop-api.azurewebsites.net/api/v1";

  static readonly SERVICE_URL = `${Constants.API_URL_V1_PREFIX}/services`;
  static readonly CUSTOMER_URL = `${Constants.API_URL_V1_PREFIX}/customers`;
  static readonly EMPLOYEE_URL = `${Constants.API_URL_V1_PREFIX}/employees`;
  static readonly APPOINTMENT_URL = `${Constants.API_URL_V1_PREFIX}/appointments`;
  static readonly AUTH_URL = `${Constants.API_URL_V1_PREFIX}/auth`;
  static readonly POINT_URL = `${Constants.API_URL_V1_PREFIX}/point`;

}

export const getErrorMessage = (error: any) : string => {
  if (typeof(error) === 'object') {
    return Object.keys(error)
              .map(key => error[key])
              .join('<br>');
  } else {
    return error;
  }
}