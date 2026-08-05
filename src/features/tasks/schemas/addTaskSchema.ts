import z from 'zod';

const baseSchema = z.object({
  content: z.string().min(1, 'Mohon pilih salah satu aktivitas.'),
  user_id: z.string().nullish(),
  detail: z.coerce
    .string()
    .max(100, 'Detail tidak boleh lebih dari 100 karakter.')
    .trim()
    .optional(),
  is_scheduled: z.boolean(),
  is_assigned: z.boolean(),
  scheduled_at: z.date().nullish(),
});

export const formSchema = baseSchema.superRefine((data, ctx) => {
  if (data.is_scheduled && !data.scheduled_at) {
    ctx.addIssue({
      code: 'custom',
      message: 'Mohon isi tanggal dan waktu.',
      path: ['scheduled_at'],
    });
  }
  if (data.is_assigned && !data.user_id) {
    ctx.addIssue({
      code: 'custom',
      message: 'Mohon pilih PIC.',
      path: ['user_id'],
    });
  }
});

export type AddTaskFormInput = z.infer<typeof formSchema>;

export const submitSchema = baseSchema
  .omit({
    is_scheduled: true,
    is_assigned: true,
    scheduled_at: true,
  })
  .extend({
    status: z.enum(['todo', 'on progress', 'done']).default('todo'),
    timestamp_todo: z.iso.datetime().default(new Date().toISOString()),
    timestamp_progress: z.iso.datetime().nullish(),
    timestamp_done: z.iso.datetime().nullish(),
    minute_pause: z.number().default(0),
    minute_activity: z.number().default(0),
    pause_time: z.iso.datetime().nullish(),
    scheduled_at: z.iso.datetime().nullish(),
    user_id: z.string(),
    assigner_id: z.string().nullish(),
    created_at: z.iso.datetime().nullish(),
    updated_at: z.iso.datetime().nullish(),
  });

export type AddTaskSubmitInput = z.infer<typeof submitSchema>;
