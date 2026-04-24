import { describe, expect, it, vi } from "vitest";
import { CategoryService } from "./category.service.js";

const now = new Date("2026-04-23T00:00:00.000Z");

function createRepositoryMock() {
  return {
    listByUser: vi.fn(),
    findByIdForUser: vi.fn(),
    findByNameForUser: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    hasLinkedExpenses: vi.fn(),
  };
}

describe("CategoryService", () => {
  it("creates a category when the name is unique", async () => {
    const repository = createRepositoryMock();
    repository.findByNameForUser.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: "cat-1",
      name: "Food & Dining",
      icon: "utensils",
      color: "#10B981",
      userId: "user-1",
      createdAt: now,
      updatedAt: now,
    });

    const service = new CategoryService(repository as never);

    const category = await service.create("user-1", {
      name: "Food & Dining",
      icon: "utensils",
      color: "#10B981",
    });

    expect(category.name).toBe("Food & Dining");
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("rejects duplicated names for the same user", async () => {
    const repository = createRepositoryMock();
    repository.findByNameForUser.mockResolvedValue({
      id: "cat-1",
      name: "Food & Dining",
    });

    const service = new CategoryService(repository as never);

    await expect(
      service.create("user-1", {
        name: "Food & Dining",
        icon: "utensils",
        color: "#10B981",
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "CATEGORY_NAME_CONFLICT",
    });
  });

  it("prevents deletion when linked expenses exist", async () => {
    const repository = createRepositoryMock();
    repository.findByIdForUser.mockResolvedValue({
      id: "cat-1",
      name: "Food & Dining",
    });
    repository.hasLinkedExpenses.mockResolvedValue(true);

    const service = new CategoryService(repository as never);

    await expect(service.remove("user-1", "cat-1")).rejects.toMatchObject({
      statusCode: 409,
      code: "CATEGORY_HAS_EXPENSES",
    });
  });
});
