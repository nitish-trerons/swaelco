import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const acmeCustomer = await prisma.customer.upsert({
    where: { contactEmail: "ops@acmetowers.com" },
    update: {},
    create: {
      name: "ACME Towers",
      contactEmail: "ops@acmetowers.com",
      contactPhone: "+1 555-981-1200",
      billingAddress: "1500 Market St, San Francisco, CA",
      notes: "Prioritizes night install windows.",
    },
  });

  const skylineCustomer = await prisma.customer.upsert({
    where: { contactEmail: "facilities@skylineholdings.com" },
    update: {},
    create: {
      name: "Skyline Holdings",
      contactEmail: "facilities@skylineholdings.com",
      contactPhone: "+1 555-442-2000",
      billingAddress: "220 Wacker Dr, Chicago, IL",
      notes: "Includes maintenance SLA.",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@swaelco.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@swaelco.com",
      passwordHash: hashPassword("Admin123!"),
      role: "admin",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "pm@swaelco.com" },
    update: {},
    create: {
      name: "Project Manager",
      email: "pm@swaelco.com",
      passwordHash: hashPassword("Manager123!"),
      role: "project_manager",
    },
  });

  const technician = await prisma.user.upsert({
    where: { email: "tech@swaelco.com" },
    update: {},
    create: {
      name: "Field Technician",
      email: "tech@swaelco.com",
      passwordHash: hashPassword("Tech123!"),
      role: "technician",
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@acmetowers.com" },
    update: { customerId: acmeCustomer.id },
    create: {
      name: "ACME Facilities",
      email: "customer@acmetowers.com",
      passwordHash: hashPassword("Customer123!"),
      role: "customer",
      customerId: acmeCustomer.id,
    },
  });

  const buildingA = await prisma.building.upsert({
    where: { id: "clzbuilding001" },
    update: {},
    create: {
      id: "clzbuilding001",
      customerId: acmeCustomer.id,
      name: "Market Tower A",
      address: "1510 Market St, San Francisco, CA",
      floors: 18,
      notes: "Active daily foot traffic.",
    },
  });

  const buildingB = await prisma.building.upsert({
    where: { id: "clzbuilding002" },
    update: {},
    create: {
      id: "clzbuilding002",
      customerId: skylineCustomer.id,
      name: "Wacker Center",
      address: "233 Wacker Dr, Chicago, IL",
      floors: 26,
      notes: "Modernization phase.",
    },
  });

  await prisma.elevator.upsert({
    where: { id: "clzelevator001" },
    update: {},
    create: {
      id: "clzelevator001",
      buildingId: buildingA.id,
      model: "SW-6000",
      capacityKg: 1600,
      status: "installation",
    },
  });

  await prisma.elevator.upsert({
    where: { id: "clzelevator002" },
    update: {},
    create: {
      id: "clzelevator002",
      buildingId: buildingB.id,
      model: "SW-MOD-420",
      capacityKg: 1200,
      status: "operational",
    },
  });

  const projectA = await prisma.project.upsert({
    where: { id: "clzproject001" },
    update: {},
    create: {
      id: "clzproject001",
      customerId: acmeCustomer.id,
      buildingId: buildingA.id,
      name: "Tower A Dual Car Installation",
      type: "new_installation",
      status: "in_progress",
      budget: 780000,
      actualCost: 342000,
      startDate: new Date("2025-11-14"),
      description: "Two traction elevators with smart dispatch controls.",
    },
  });

  const projectB = await prisma.project.upsert({
    where: { id: "clzproject002" },
    update: {},
    create: {
      id: "clzproject002",
      customerId: skylineCustomer.id,
      buildingId: buildingB.id,
      name: "Wacker Center Modernization",
      type: "modernization",
      status: "inspection",
      budget: 430000,
      actualCost: 398000,
      startDate: new Date("2025-08-02"),
      endDate: new Date("2026-02-28"),
      description: "Controller upgrade and cabin refresh with safety retrofit.",
    },
  });

  const taskSeeds = [
    {
      id: "clztask001",
      projectId: projectA.id,
      assignedToUserId: technician.id,
      title: "Install safety gear",
      description: "Install and verify guide rail safety gear assembly.",
      scheduledFor: new Date("2026-02-15T14:30:00.000Z"),
      status: "pending",
    },
    {
      id: "clztask002",
      projectId: projectA.id,
      assignedToUserId: technician.id,
      title: "Door alignment check",
      description: "Perform shaft-door edge alignment and tolerance check.",
      scheduledFor: new Date("2026-02-18T17:00:00.000Z"),
      status: "in_progress",
    },
    {
      id: "clztask003",
      projectId: projectB.id,
      assignedToUserId: manager.id,
      title: "Final inspector walkthrough",
      description: "Coordinate local inspector walkthrough and sign-off.",
      scheduledFor: new Date("2026-02-20T16:00:00.000Z"),
      status: "pending",
    },
  ];

  for (const task of taskSeeds) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: task,
      create: task,
    });
  }

  const documentSeeds = [
    {
      id: "clzdoc001",
      projectId: projectA.id,
      name: "Permit Pack - Tower A",
      url: "/documents/permit-pack-tower-a.pdf",
      type: "permit",
    },
    {
      id: "clzdoc002",
      projectId: projectB.id,
      name: "Inspection Report - Wacker Center",
      url: "/documents/wacker-inspection.pdf",
      type: "inspection_report",
    },
  ];

  for (const document of documentSeeds) {
    await prisma.document.upsert({
      where: { id: document.id },
      update: document,
      create: document,
    });
  }

  const commentSeeds = [
    {
      id: "clzcomment001",
      projectId: projectA.id,
      authorId: manager.id,
      body: "Machine-room panel delivery confirmed for next Tuesday.",
    },
    {
      id: "clzcomment002",
      projectId: projectA.id,
      authorId: customerUser.id,
      body: "Please keep west loading dock clear after 8 PM install window.",
    },
  ];

  for (const comment of commentSeeds) {
    await prisma.projectComment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }

  await prisma.auditLog.upsert({
    where: { id: "clzaudit001" },
    update: {},
    create: {
      id: "clzaudit001",
      userId: admin.id,
      action: "seed.initialized",
      entityType: "system",
      entityId: "bootstrap",
      metadata: {
        createdBy: "prisma-seed",
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
