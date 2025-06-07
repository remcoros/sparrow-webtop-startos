import { sdk } from '../sdk'

export const restartService = sdk.Action.withoutInput(
  // id
  'restart-service',

  // metadata
  async ({ effects }) => {
    return {
      name: 'Restart Service',
      description: 'This will restart the service',
      warning: null,
      allowedStatuses: 'only-running',
      group: 'Maintenance',
      visibility: 'hidden',
    }
  },

  // execution function
  async ({ effects }) => {
    await sdk.restart(effects)

    return {
      version: '1',
      title: 'Success',
      message:
        'Service restarted successfully. Please wait a few seconds for the service to be available again.',
      result: null,
    }
  },
)
