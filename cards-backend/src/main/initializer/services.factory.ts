import { UserService } from "../../services/user.service";
import { EmailService } from "../../services/mail.service";
import { LoginService } from "../../services/login.service";
import { IdService } from "../../services/id.service";
import { CleanupService } from "../../services/cleanup.service";

type ServiceClassMap = {
	UserService: UserService;
	EmailService: EmailService;
	LoginService: LoginService;
	IdService: IdService;
	CleanupService: CleanupService;
};

type ServiceConstructorMap = {
	[K in keyof ServiceClassMap]: new (...args: any[]) => ServiceClassMap[K];
};

const serviceClasses: ServiceConstructorMap = {
	UserService,
	EmailService,
	LoginService,
	IdService,
	CleanupService,
};

type ServiceInstanceMap<T> = {
	[K in keyof T]: T[K] extends new (...args: infer P) => infer R ? (...args: P) => R : never;
};

function createServiceFactory<T extends Record<string, new (...args: any[]) => any>>(serviceClasses: T): ServiceInstanceMap<T> {
	const serviceFactory: Partial<ServiceInstanceMap<T>> = {};

	for (const key in serviceClasses) {
		serviceFactory[key as keyof T] = ((...args: any[]) => {
			const ServiceClass = serviceClasses[key as keyof T];
			return new ServiceClass(...args);
		}) as any;
	}

	return serviceFactory as ServiceInstanceMap<T>;
}

export const serviceFactory = createServiceFactory(serviceClasses);
