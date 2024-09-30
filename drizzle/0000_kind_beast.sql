CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctor_id` varchar(255) NOT NULL,
	`patient_id` varchar(255) NOT NULL,
	`appointment_date` timestamp NOT NULL,
	`status` enum('f','fj','fm','ok'),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctors_work_day` (
	`doctor_id` varchar(255) NOT NULL,
	`week_days_enum` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL
);
--> statement-breakpoint
CREATE TABLE `doctors_work_period` (
	`doctor_id` varchar(255) NOT NULL,
	`periods` enum('m','t','n') NOT NULL
);
--> statement-breakpoint
CREATE TABLE `doctors` (
	`id` varchar(255) NOT NULL,
	`job_function` varchar(128) NOT NULL,
	`crm` varchar(12) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `doctors_id` PRIMARY KEY(`id`),
	CONSTRAINT `doctors_id_unique` UNIQUE(`id`),
	CONSTRAINT `doctors_crm_unique` UNIQUE(`crm`),
	CONSTRAINT `doctors_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `patients_referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` varchar(255) NOT NULL,
	`crm` varchar(12) NOT NULL,
	`cid` varchar(12) NOT NULL,
	`job_function` varchar(128) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `patients_referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(14) NOT NULL,
	`rg` varchar(12),
	`insurance` varchar(255),
	`insuranceNumber` varchar(30),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patients_id_unique` UNIQUE(`id`),
	CONSTRAINT `patients_rg_unique` UNIQUE(`rg`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`user_roles` enum('admin','regular','doctor') NOT NULL DEFAULT 'regular',
	`password` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctors_work_day` ADD CONSTRAINT `doctors_work_day_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctors_work_period` ADD CONSTRAINT `doctors_work_period_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patients_referrals` ADD CONSTRAINT `patients_referrals_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `patient_doctor_index` ON `appointments` (`patient_id`,`doctor_id`);--> statement-breakpoint
CREATE INDEX `referral_index` ON `patients_referrals` (`patient_id`);