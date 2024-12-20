import { toBase64Encode } from "@/utils";

export interface Transaction {
  amount: number;
  currency: "PHP" | "USD";
  description: string;
  email: string;
  mobileNo?: string;
  param1?: any;
  param2?: any;
  expiry?: Date;
}

export interface BillingInfo {
  firstname: string;
  lastname: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  telno: string;
  email: string;
}

export interface ShippingInfo {
  firstname: string;
  middlename: string;
  lastname: string;
  address1: string;
  address2: string;
  barangay: string;
  city: string;
  province: string;
  country: string;
  zipCode: string;
  landmark: string;
  telno: string;
  email: string;
}

export type TransactionDetails =
  | (Transaction & {
      procId?: "CC";
      billingDetails?: BillingInfo;
    })
  | (Transaction & {
      procId?: "LBCX";
      senderShippingDetails?: ShippingInfo;
      recipientShippingDetails?: ShippingInfo;
    })
  | (Transaction & {
      procId?: string;
    });

export interface CollectionClientOptions {
  /**
   * Dragonpay assigned merchant id.
   */
  mid: string;

  /**
   * Dragonpay assigned API collection secret key.
   */
  secret: string;

  /**
   * API optional parameters
   */
  options?: {
    /**
     * version of dragonpay collection api to be consumed.
     *
     * default: v1
     */
    version: "v1" | "v2";
  };
}

export default function CollectionClient({
  mid,
  secret,
  options = { version: "v1" }
}: CollectionClientOptions) {
  const env = process.env.NODE_ENV === "development" ? "test" : "gw";

  const version = options?.version;
  const endpoint = `https://${env}.dragonpay.ph/api/collect/${version}`;

  /**
   * create a new collection transaction.
   * @param txnid unique transaction id that represent the whole transaction.
   * @param data data that dragonpay will process
   */
  async function collect(txnid: string, data: TransactionDetails) {
    try {
      const request = await fetch(`${endpoint}/${txnid}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${toBase64Encode(`${mid}:${secret}`)}`
        },
        body: JSON.stringify(data)
      });

      return await request.json();
    } catch (error) {
      console.log("collect: unable to process request");
      throw error;
    }
  }

  /**
   * get transaction details using the provided refno
   * @param refno unique reference number assigned to a transaction.
   */
  async function getTransactionByRefno(refno: string) {
    try {
      const request = await fetch(`${endpoint}/refno/${refno}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${toBase64Encode(`${mid}:${secret}`)}`
        }
      });

      return await request.json();
    } catch (error) {
      console.log("getTransactionByRefno: unable to process request");
      throw error;
    }
  }

  /**
   * get transaction details using the provided txnid
   * @param txnid unique transaction id assigned to a transaction.
   */
  async function getTransactionByTxnid(txnid: string) {
    try {
      const request = await fetch(`${endpoint}/txnid/${txnid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${toBase64Encode(`${mid}:${secret}`)}`
        }
      });

      return await request.json();
    } catch (error) {
      console.log("getTransactionByTxnid: unable to process request");
      throw error;
    }
  }

  /**
   * void transaction based on the provided txnid.
   * @param txnid unique transaction id assigned to a transaction.
   */
  async function cancelTransaction(txnid: string) {
    try {
      const request = await fetch(`${endpoint}/void/${txnid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${toBase64Encode(`${mid}:${secret}`)}`
        }
      });
      return await request.json();
    } catch (error) {
      console.log("cancelTransaction: unable to process request");
      throw error;
    }
  }

  async function getTransactions(from: Date, to: Date) {
    const parseDate = (date: Date) =>
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    try {
      const request = await fetch(
        `${endpoint}/transactions?startdate=${parseDate(from)}&enddate=${parseDate(to)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${toBase64Encode(`${mid}:${secret}`)}`
          }
        }
      );
      return await request.json();
    } catch (error) {
      console.log("cancelTransaction: unable to process request");
      throw error;
    }
  }

  async function getSettledTransactions(from: Date, to: Date) {
    const parseDate = (date: Date) =>
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    try {
      const request = await fetch(
        `${endpoint}/settled?startdate=${parseDate(from)}&enddate=${parseDate(to)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${toBase64Encode(`${mid}:${secret}`)}`
          }
        }
      );
      return await request.json();
    } catch (error) {
      console.log("cancelTransaction: unable to process request");
      throw error;
    }
  }

  return {
    collect,
    cancelTransaction,
    getTransactionByRefno,
    getTransactionByTxnid,
    getTransactions,
    getSettledTransactions
  };
}
