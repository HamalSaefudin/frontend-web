import { describe, expect, it } from "vitest";
import {
  createMasterKas,
  deleteMasterKas,
  getMasterKasList,
  updateMasterKas,
  updateMasterKasStatus,
} from "../../src/services/master-kas";

describe("master-kas service", () => {
  describe("getMasterKasList", () => {
    it("should return list of kas with pagination", async () => {
      const result = await getMasterKasList({ page: 1, limit: 10 });

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
    });

    it("should filter by namaKas search", async () => {
      const result = await getMasterKasList({
        page: 1,
        limit: 10,
        namaKas: "Jakarta",
      });

      expect(result.data).toBeDefined();
      result.data.forEach((kas) => {
        expect(kas.namaKas.toLowerCase()).toContain("jakarta");
      });
    });

    it("should filter by status", async () => {
      const result = await getMasterKasList({
        page: 1,
        limit: 10,
        status: true,
      });

      expect(result.data).toBeDefined();
      result.data.forEach((kas) => {
        expect(kas.status).toBe(true);
      });
    });
  });

  describe("createMasterKas", () => {
    it("should create new kas", async () => {
      const newKas = {
        kodeKas: "KS999",
        namaCabang: "Cabang Test",
        namaKas: "Kas Test",
        status: true,
      };

      const result = await createMasterKas(newKas);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.kodeKas).toBe("KS999");
    });

    it("should fail for duplicate kodeKas", async () => {
      const newKas = {
        kodeKas: "KS001", // Already exists in dummy data
        namaCabang: "Cabang Test",
        namaKas: "Kas Test",
        status: true,
      };

      const result = await createMasterKas(newKas);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("DUPLICATE_KODE_KAS");
    });
  });

  describe("updateMasterKas", () => {
    it("should update existing kas", async () => {
      const result = await updateMasterKas("1", { namaKas: "Updated Kas" });

      expect(result.success).toBe(true);
      expect(result.data?.namaKas).toBe("Updated Kas");
    });

    it("should return error for non-existent kas", async () => {
      const result = await updateMasterKas("999", { namaKas: "Updated Kas" });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("NOT_FOUND");
    });
  });

  describe("deleteMasterKas", () => {
    it("should delete existing kas", async () => {
      const result = await deleteMasterKas("1");

      expect(result.success).toBe(true);
    });

    it("should return error for non-existent kas", async () => {
      const result = await deleteMasterKas("999");

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("NOT_FOUND");
    });
  });

  describe("updateMasterKasStatus", () => {
    it("should update kas status", async () => {
      const result = await updateMasterKasStatus("1", false);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe(false);
    });
  });
});