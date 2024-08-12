import axiosClient, { AxiosError, AxiosInstance } from "axios";

import { endpoint } from "@/utils";
import { toBase64 } from "@/libs/base64";
import { Transaction } from "@/types/transaction";
import { ClientOptions } from "@/types/client-options";
import { TransactionResponse } from "@/types/transcation-response";

export class CollectionClient {
  private axios: AxiosInstance;

  constructor({ apiKey, merchantId, version = "v1" }: ClientOptions) {
    this.axios = axiosClient.create({
      baseURL: `https://test.dragonpay.ph/api/collect/${version}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${toBase64(`${merchantId}:${apiKey}`)}`
      }
    });
  }

  public async createTransaction(txnId: string, payload: Transaction) {
    try {
      const response = await this.axios.post(`/${txnId}/post`, payload);
      return response.data as TransactionResponse;
    } catch (error) {
      if (error instanceof AxiosError) return error.message;
    }
  }
}
