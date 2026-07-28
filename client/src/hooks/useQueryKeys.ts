type PropertiFilter = {
  kategori?: "HOTEL" | "VILLA" | "APARTEMEN" | "KOSAN" | "KONTRAKAN";
  status?: "aktif" | "nonaktif";
  search?: string;
};

type AdminFilter = {
  status?: "AKTIF" | "NONAKTIF" | "DIBLOKIR";
  search?: string;
};

export const queryKeys = {
  properti: {
    all: ["properti"] as const,
    lists: () => [...queryKeys.properti.all, "list"] as const,
    list: (filters: PropertiFilter = {}) =>
      [...queryKeys.properti.lists(), { ...filters }] as const,
    details: () => [...queryKeys.properti.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.properti.details(), id] as const,
  },
  admin: {
    all: ["admin"] as const,
    lists: () => [...queryKeys.admin.all, "list"] as const,
    list: (filters: AdminFilter = {}) =>
      [...queryKeys.admin.lists(), { ...filters }] as const,
    details: () => [...queryKeys.admin.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.admin.details(), id] as const,
  },
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
} as const;

export type { PropertiFilter, AdminFilter };
