class SpaceNameTooLongError extends Error {
  readonly details: { spaceName: string; length: number };
  constructor(spaceName: string) {
    super('Space name too long');
    this.details = { spaceName, length: spaceName.length };
    Object.setPrototypeOf(this, SpaceNameTooLongError.prototype);
  }
}

class SpaceCreationFailedError extends Error {
  readonly details: { spaceName: string };
  constructor(spaceName: string) {
    super('Space creation failed');
    this.details = { spaceName };
    Object.setPrototypeOf(this, SpaceCreationFailedError.prototype);
  }
}

class EnvironmentNameTooLongError extends Error {
  readonly details: { environmentName: string; length: number };
  constructor(environmentName: string) {
    super('Space name too long');
    this.details = { environmentName, length: environmentName.length };
    Object.setPrototypeOf(this, EnvironmentNameTooLongError.prototype);
  }
}

class EnvironmentCreationFailedError extends Error {
  readonly details: { environmentName: string };
  constructor(environmentName: string) {
    super('Environment creation failed');
    this.details = { environmentName };
    Object.setPrototypeOf(this, EnvironmentCreationFailedError.prototype);
  }
}

class EnvironmentNotReadyError extends Error {
  readonly details: {
    spaceName: string;
    environmentName: string;
    timeout: number;
  };
  constructor(spaceName: string, environmentName: string, timeout: number) {
    super('Environment not ready for too long');
    this.details = {
      spaceName,
      environmentName,
      timeout,
    };
    Object.setPrototypeOf(this, EnvironmentNotReadyError.prototype);
  }
}

class MissingCredentialError extends Error {
  readonly details: { credentialName: string };
  constructor(credentialName: string) {
    super('Missing credential');
    this.details = {
      credentialName,
    };
    Object.setPrototypeOf(this, MissingCredentialError.prototype);
  }
}

class SpaceNotProvidedError extends Error {}

export {
  SpaceNameTooLongError,
  SpaceCreationFailedError,
  EnvironmentNameTooLongError,
  EnvironmentCreationFailedError,
  EnvironmentNotReadyError,
  MissingCredentialError,
  SpaceNotProvidedError,
};
