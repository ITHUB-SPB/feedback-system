import * as v from "valibot";

export const basePaginationInput = v.object({
  limit: v.optional(
    v.pipe(
      v.union([v.string(), v.number()]),
      v.transform(Number),
      v.number(),
      v.picklist([12, 24, 48]),
    ),
  ),
  offset: v.optional(
    v.pipe(
      v.union([v.string(), v.number()]),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(0),
    ),
  ),
});

export const baseSortInput = v.optional(
  v.union([
    v.pipe(
      v.string(),
      v.transform((s) => decodeURI(s).split("&")),
      v.array(v.string()),
    ),
    v.array(
      v.pipe(
        v.string(),
        v.transform((s) => decodeURI(s)),
      ),
    ),
  ]),
);

export const baseFilterInput = v.optional(
  v.union([
    v.pipe(
      v.string(),
      v.transform((s) => decodeURI(s).split("&")),
      v.array(v.string()),
    ),
    v.array(
      v.pipe(
        v.string(),
        v.transform((s) => decodeURI(s)),
      ),
    ),
  ]),
);

export const baseInputOne = v.object({
  id: v.union([
    v.pipe(
      v.string(),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(1),
    ),
    v.pipe(v.string()),
    v.pipe(v.number(), v.integer(), v.minValue(1)),
  ]),
});

const structuredSortInput = v.array(
  v.object({
    field: v.string(),
    order: v.picklist(["asc", "desc"])
  })
)

const structuredFilterInput = v.array(
  v.object({
    field: v.string(),
    operator: v.picklist(["eq", "ne", "gt", "lt", "in"]),
    value: v.union([v.pipe(v.string(), v.transform(Number), v.integer()), v.string()])
  })
)

export const baseInputAll = v.object({
  ...basePaginationInput.entries,
  sort: baseSortInput,
  filter: baseFilterInput,
  export: v.optional(v.string()),
});

export const structuredInputAll = v.object({
  ...basePaginationInput.entries, // TODO
  sort: v.optional(structuredSortInput),
  filter: v.optional(structuredFilterInput)
})

export type BaseInputAll = v.InferOutput<typeof baseInputAll>;
