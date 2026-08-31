export class NotFoundError extends Error { constructor(resource) { super(`${resource} not found`); this.name = "NotFoundError"; this.statusCode = 404; } }

