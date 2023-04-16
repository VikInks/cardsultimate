import "reflect-metadata";

export function ApiSummary(summary: string) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:summary", summary, target, key);
	};
}

export function ApiDescription(description: string) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:description", description, target, key);
	};
}

export function ApiTags(tags: string[]) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:tags", tags, target, key);
	};
}

export function ApiBody(body: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:body", body, target, key);
	};
}

export function ApiPath(path: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:path", path, target, key);
	};
}

export function ApiQuery(query: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:query", query, target, key);
	};
}

export function ApiHeader(header: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:header", header, target, key);
	};
}

export function ApiParam(param: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:param", param, target, key);
	};
}

export function ApiResponse(response: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:response", response, target, key);
	};
}

export function ApiSecurity(security: any) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:security", security, target, key);
	};
}

export function ApiDeprecated(deprecated: boolean) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:deprecated", deprecated, target, key);
	};
}

export function ApiOperationId(operationId: string) {
	return (target: any, key: string) => {
		Reflect.defineMetadata("swagger:operationId", operationId, target, key);
	};
}

