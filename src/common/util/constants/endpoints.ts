export const ENDPOINTS = {
    COMMON: {
      HEALTH_CHECK: '/health',
      EVENTS: '/events'
    },
    FLASH_DEAL: {
      BASE: '/flash-deals',
      ITEMS: '/flash-deals/items'
    },
    RAFFLE: {
      BASE: '/raffles',
      PARTICIPANTS: '/raffles/participants'
    }
  } as const
  