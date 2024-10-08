import { zodResolver } from "@hookform/resolvers/zod"
import { CheckMini, Spinner, ThumbnailBadge } from "@medusajs/icons"
// @ts-ignore
import type { Image, Product } from "@medusajs/medusa"
import { Button, CommandBar, Tooltip, clx, toast } from "@medusajs/ui"
import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useCallback, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { useParams } from "react-router-dom"

import { Link } from "react-router-dom"
import {
  type FileType,
  FileUpload,
} from "@medusajs/dashboard/src/components/common/file-upload"
import { Form } from "@medusajs/dashboard/src/components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "@medusajs/dashboard/src/components/route-modal"

type ProductMediaViewProps = {
  product: Product
}

const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  isThumbnail: z.boolean(),
  file: z.any().nullable(), // File
})

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

const SUPPORTED_FORMATS_FILE_EXTENSIONS = [
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".svg",
]

type Media = z.infer<typeof MediaSchema>

const EditProductMediaSchema = z.object({
  media: z.array(MediaSchema),
})

export const EditProductMediaForm = ({ product }: ProductMediaViewProps) => {
  const [selection, setSelection] = useState<Record<string, true>>({})
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { id, variant_id } = useParams()
  const images = []
  product.variants.map((variant) => {
    if (variant.id === variant_id) {
      variant.images.map((image) => {
        images.push(image)
      })
    }
  })

  const form = useForm<z.infer<typeof EditProductMediaSchema>>({
    defaultValues: {
      media: getDefaultValues(images, ''),
    },
    resolver: zodResolver(EditProductMediaSchema),
  })

  const { fields, append, remove, update } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const [ isLoading = false, setIsLoading ] = useState(Boolean)

  const handleSubmit = form.handleSubmit(async ({ media }) => {
    setIsLoading(true)
    const urls = media.map((m) => m.url)

    const filesToUpload = media
      .map((m, index) => ({ file: m.file, index }))
      .filter((m) => m.file)

    if (filesToUpload.length) {
      const files = filesToUpload.map((m) => m.file) as File[]

      const formData = new FormData();
      files.map((file) => {
        formData.append("files", file);
      })
      const uploadResponse = await fetch("/admin/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      const uploads = await uploadResponse.json()
      uploads.files.map((file, i) => {
        const originalIndex = filesToUpload[i].index
        urls[originalIndex] = file.url
      })
    }

    const formDataImages = new URLSearchParams();
    urls.map(async (url) => {
      await formDataImages.append("images", url)
    })
    const updateVariantImages = await fetch(`/admin/custom/products/${id}/variants/${variant_id}/images`, {
      method: "POST",
      body: formDataImages,
    })
    await updateVariantImages.json()
    setIsLoading(true)
    handleSuccess()
    toast.success(t("general.success"), {
      description: "Variant images was successfully updated.",
      dismissLabel: t("actions.close"),
    })
  })

  const hasInvalidFiles = (fileList: FileType[]) => {
    const invalidFile = fileList.find(
      (f) => !SUPPORTED_FORMATS.includes(f.file.type)
    )

    if (invalidFile) {
      form.setError("media", {
        type: "invalid_file",
        message: t("products.media.invalidFileType", {
          name: invalidFile.file.name,
          types: SUPPORTED_FORMATS_FILE_EXTENSIONS.join(", "),
        }),
      })

      return true
    }

    return false
  }

  const handleCheckedChange = useCallback(
    (id: string) => {
      return (val: boolean) => {
        if (!val) {
          const { [id]: _, ...rest } = selection
          setSelection(rest)
        } else {
          setSelection((prev) => ({ ...prev, [id]: true }))
        }
      }
    },
    [selection]
  )

  const handleDelete = () => {
    const ids = Object.keys(selection)
    const indices = ids.map((id) => fields.findIndex((m) => m.id === id))

    remove(indices)
    setSelection({})
  }

  const handlePromoteToThumbnail = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    const currentThumbnailIndex = fields.findIndex((m) => m.isThumbnail)

    if (currentThumbnailIndex > -1) {
      update(currentThumbnailIndex, {
        ...fields[currentThumbnailIndex],
        isThumbnail: false,
      })
    }

    const index = fields.findIndex((m) => m.id === ids[0])

    update(index, {
      ...fields[index],
      isThumbnail: true,
    })

    setSelection({})
  }

  const selectionCount = Object.keys(selection).length

  return (
    <RouteFocusModal.Form blockSearch form={form}>
      <form
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button variant="secondary" size="small" asChild>
              <Link to={{ pathname: ".", search: undefined }}>
                {t("products.media.galleryLabel")}
              </Link>
            </Button>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
            <div className="bg-ui-bg-subtle size-full overflow-auto">
              <div className="grid h-fit auto-rows-auto grid-cols-4 gap-6 p-6">
                {fields.map((m) => {
                  return (
                    <GridItem
                      onCheckedChange={handleCheckedChange(m.id)}
                      checked={!!selection[m.id]}
                      key={m.field_id}
                      media={m}
                    />
                  )
                })}
              </div>
            </div>
            <div className="bg-ui-bg-base border-b px-6 py-4 lg:border-b-0 lg:border-l">
              <Form.Field
                control={form.control}
                name="media"
                render={() => {
                  return (
                    <Form.Item>
                      <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-1">
                          <Form.Label optional>
                            {t("products.media.label")}
                          </Form.Label>
                          <Form.Hint>{t("products.media.editHint")}</Form.Hint>
                        </div>
                        <Form.Control>
                          <FileUpload
                            label={t("products.media.uploadImagesLabel")}
                            hint={t("products.media.uploadImagesHint")}
                            hasError={!!form.formState.errors.media}
                            formats={SUPPORTED_FORMATS}
                            onUploaded={(files) => {
                              form.clearErrors("media")
                              if (hasInvalidFiles(files)) {
                                return
                              }

                              // biome-ignore lint/complexity/noForEach: <explanation>
                              files.forEach((f) =>
                                append({ ...f, isThumbnail: false })
                              )
                            }}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </div>
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <CommandBar open={!!selectionCount}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: selectionCount,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            {selectionCount === 1 && (
              <Fragment>
                <CommandBar.Command
                  action={handlePromoteToThumbnail}
                  label={"Make thumbnail"}
                  shortcut="t"
                />
                <CommandBar.Seperator />
              </Fragment>
            )}
            <CommandBar.Command
              action={handleDelete}
              label={t("actions.delete")}
              shortcut="d"
            />
          </CommandBar.Bar>
        </CommandBar>
      </form>
    </RouteFocusModal.Form>
  )
}

const GridItem = ({
  media,
  checked,
  onCheckedChange,
}: {
  media: Media
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(true)

  const { t } = useTranslation()

  const handleToggle = useCallback(() => {
    onCheckedChange(!checked)
  }, [checked, onCheckedChange])

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full overflow-hidden rounded-lg outline-none"
    >
      {media.isThumbnail && (
        <div className="absolute left-2 top-2">
          <Tooltip content={t("products.media.thumbnailTooltip")}>
            <ThumbnailBadge />
          </Tooltip>
        </div>
      )}
      <div
        className={clx(
          "transition-fg absolute right-2 top-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
          {
            "opacity-100": checked,
          }
        )}
      >
        <div
          className={clx(
            "group relative inline-flex h-5 w-5 items-center justify-center outline-none "
          )}
        >
          <div
            className={clx(
              "text-ui-fg-on-inverted bg-ui-bg-component shadow-borders-base [&_path]:shadow-details-contrast-on-bg-interactive group-disabled:text-ui-fg-disabled group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base transition-fg h-[14px] w-[14px] rounded-[3px]",
              {
                "bg-ui-bg-interactive group-hover:bg-ui-bg-interactive shadow-borders-interactive-with-shadow":
                  checked,
              }
            )}
          >
            {checked && (
              <div className="absolute inset-0">
                <CheckMini />
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="bg-ui-bg-subtle-hover absolute inset-0 flex items-center justify-center"
          >
            <Spinner className="text-ui-fg-subtle animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      <img
        src={media.url}
        onLoad={() => setIsLoading(false)}
        alt=""
        className="size-full object-cover object-center"
      />
    </button>
  )
}

const getDefaultValues = (images: Image[] | null, thumbnail: string | null) => {
  const media: Media[] =
    images?.map((image) => ({
      id: image.id,
      url: image.url,
      isThumbnail: image.url === thumbnail,
      file: null,
    })) || []

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    const id = Math.random().toString(36).substring(7)

    media.unshift({
      id: id,
      url: thumbnail,
      isThumbnail: true,
      file: null,
    })
  }

  return media
}
