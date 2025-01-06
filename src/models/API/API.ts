import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { boundMethod } from 'autobind-decorator';
/**
 * axios를 통해 서버와 통신하는 API 클래스입니다.
 */
class API {
  /**
   * 통신에 사용되는 base URL 주소입니다.
   */
  private baseUrl: string;

  /**
   * 생성자
   */
  public constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
    axios.defaults.baseURL = this.baseUrl;
  }

  /**
   * Base URL 주소를 반환합니다.
   * @returns 해당 object 의 base URL
   */
  @boundMethod
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * URI를 반환합니다.
   * @param config Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns String 형태의 URI입니다.
   */
  public getUri(config?: AxiosRequestConfig): string {
    return axios.getUri(config);
  }

  /**
   * POST 통신을 수행합니다.
   * @param url POST 통신을 위한 url 입니다. Base url 은 생략합니다.
   * @param data POST 요청으로 보내질 body의 payload 입니다. (B: body request object)
   * @param config POST 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public post<B>(url: string, data: B, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.post(url, data, config);
  }

  /**
   * GET 통신을 수행합니다.
   * @param url GET 통신을 위한 url 입니다. Base url 은 생략합니다.
   * @param config GET 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.get(url, config);
  }

  /**
   * PUT 통신을 수행합니다.
   * @param url PUT 통신을 위한 url 입니다. Base url 은 생략합니다.
   * @param data PUT 요청으로 보내질 body의 payload 입니다. (B: body request object)
   * @param config PUT 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public put<B>(url: string, data: B, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.put(url, data, config);
  }

  /**
   * PATCH 통신을 수행합니다.
   * @param url PATCH 통신을 위한 url 입니다. Base url 은 생략합니다.
   * @param data PATCH 요청으로 보내질 body의 payload 입니다. (B: body request object)
   * @param config PATCH 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public patch<B>(url: string, data: B, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.patch(url, data, config);
  }

  /**
   * DELETE 통신을 수행합니다.
   * @param url DELETE 통신을 위한 url 입니다. Base url 은 생략합니다.
   * @param config DELETE 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.delete(url, config);
  }

  /**
   * HEAD 통신을 수행합니다.
   * @param url HEAD 통신을 위한 url 입니다. Base url 은 생략합니다.
   * @param config HEAD 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.head(url, config);
  }

  /**
   * REQUEST 통신을 수행합니다.
   * @param config REQUEST 통신을 위한 Axios 설정입니다. 입력하지 않으면 기본 설정으로 동작합니다.
   * @returns Promise 형태의 axios response
   */
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.request(config);
  }
}

export default new API();
