export const ALL_PERMISSIONS = [
  "user:write",
  "user:roles:write",
  "user:roles:read",

  "paciente:write",
  "paciente:read",

  "medico:write",
  "medico:read",
] as const;

const PERMISSIONS = ALL_PERMISSIONS.reduce(
  (acc, perm) => {
    acc[perm] = perm;
    return acc;
  },
  {} as Record<
    (typeof ALL_PERMISSIONS)[number],
    (typeof ALL_PERMISSIONS)[number]
  >,
);

export const WORKER_ROLE = [
  PERMISSIONS["paciente:read"],
  PERMISSIONS["paciente:write"],
  PERMISSIONS["medico:write"],
  PERMISSIONS["medico:read"],
];

export const DOCTOR_ROLE = [
  PERMISSIONS["paciente:read"],
  PERMISSIONS["paciente:write"],
];

export const ADMIN_ROLE = [...ALL_PERMISSIONS];
