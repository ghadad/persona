// create zod schema for shell plugin 
// props are :
// shell command : string
// shell args : array of string
//
import { z } from 'zod'

export const shellSchema = {
    body: z.object({
        shellCommand: z.string(),
        shellArgs: z.array(z.string())
    })
}
