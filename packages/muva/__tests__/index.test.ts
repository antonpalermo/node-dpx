import MUVAClient from "@/index";
import fetch from "jest-fetch-mock";

const client = MUVAClient({
  mid: `${process.env.MERCHANT_ID}`,
  secret: `${process.env.MERCHANT_COLLECTION_API_KEY}`,
  bin: `${process.env.MERCHANT_BIN}`
});

beforeEach(() => {
  fetch.resetMocks();
});

describe("MUVA client version 1", () => {
  test("client able create a MUVA id", async () => {
    fetch.mockResponseOnce(JSON.stringify("ZZ000527"));
    const lid = await client.create({
      email: `${process.env.EMAIL}`,
      name: "Anton Palermo",
      remarks: "lid package tests create sample lid",
      preferredId: "1234567890"
    });
    expect(lid).toBe("ZZ000527");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("client able to fetch MUVA id details", async () => {
    const response = {
      userId: "ZZ000527",
      merchantId: `${process.env.MERCHANT_ID}`,
      custName: "Anton Palermo",
      custEmail: `${process.env.EMAIL}`,
      remarks: "test create lid",
      status: "A",
      created: "2024-11-04T21:32:39.3966667",
      staticQr: null
    };

    fetch.mockResponse(JSON.stringify(response));

    const details = await client.getDetails("ZZ000527");
    expect(details).toEqual(response);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("client able to activate MUVA id", async () => {
    fetch.mockResponseOnce("", { status: 200 });

    const result = await client.activate("ZZ000527");

    expect(result?.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("client able to deactivate MUVA id", async () => {
    fetch.mockResponseOnce("", { status: 200 });

    const result = await client.deactivate("ZZ000527");

    expect(result?.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("client able to update details", async () => {
    fetch.mockResponseOnce("Success", { status: 200 });
    const result = await client.updateDetails("ZZ000527", {
      email: process.env.EMAIL,
      name: "Updated name"
    });

    expect(result?.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
