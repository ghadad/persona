// craete zod schema for uri plugin 
// props :  uri : string
// data path : string
//

import { z } from 'zod'

export const uriSchema = {
    body: z.object({
        uri: z.string(),
        dataPath: z.string()
    })
}

