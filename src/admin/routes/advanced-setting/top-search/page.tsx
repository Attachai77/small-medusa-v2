import BackButton from '../../../components/back-button'
import { Button, Container, Input, Select, toast } from '@medusajs/ui'
import { type ChangeEvent, useEffect, useState } from 'react'
import { useForm, FormProvider } from "react-hook-form";
import { Form } from '@medusajs/dashboard/src/components/common/form'
import type { RecommendSettingForm, TopSearchConfigDataForm } from "../../../../types/top-search"
import { useTranslation } from "react-i18next"
import { findConfigDataByPath } from '../../../../admin/utils/config-data';
import {
  Trash,
} from "@medusajs/icons";

const TopSearchSettingPage = () => {
  const { t } = useTranslation()
  const [ recommends, setRecommends ] = useState<RecommendSettingForm[]>([])

  const form = useForm<TopSearchConfigDataForm>()
  const {
    setValue, 
    handleSubmit,
  } = form

  const TOP_SEARCH_GENERAL_ENABLED = 'top-search/general/enabled'
  const TOP_SEARCH_GENERAL_DISPLAY_MODE = 'top-search/general/display_mode'

  const onSubmit = handleSubmit((data: TopSearchConfigDataForm) => {
    fetch("/admin/top-searches", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recommends),
    })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      });
    fetch("/admin/config-data", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success(t("general.success"), {
          description: "Top search setting was successfully updated.",
          dismissLabel: t("actions.close"),
        })
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      });
  })

  const enableOptions = [
    { value: '1', label: "Yes" },
    { value: '0', label: "No" },
  ];

  const displayModeOptions = [
    { value: 'search-engine', label: "Search Engine" },
    { value: 'recommend', label: "Recommend" },
    { value: 'both', label: "Both" },
  ]

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setValue("genaral.enabled.path", TOP_SEARCH_GENERAL_ENABLED)
    setValue("genaral.enabled.value", 'no')
    setValue("genaral.display_mode.path", TOP_SEARCH_GENERAL_DISPLAY_MODE)
    setValue("genaral.display_mode.value", 'search-engine')
    const params = new URLSearchParams({
      'paths[0]': TOP_SEARCH_GENERAL_ENABLED,
      'paths[1]': TOP_SEARCH_GENERAL_DISPLAY_MODE,
    });
    fetch(`/admin/config-data?${params.toString()}`, {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          const enabled_value = findConfigDataByPath(res.data, TOP_SEARCH_GENERAL_ENABLED)
          const display_mode = findConfigDataByPath(res.data, TOP_SEARCH_GENERAL_DISPLAY_MODE)
          setValue("genaral.enabled.value", enabled_value)
          setValue("genaral.display_mode.value", display_mode)
        }
      })
      .catch((error) => { 
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      })
    fetch("/admin/top-searches", {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          const recommends: RecommendSettingForm[] = []
          res.data.map((item) => {
            recommends.push(
              {
                id: item.id,
                name_value: item.search,
                uri_value: item.uri
              }
            )
          })
          setRecommends(recommends)
        }
      })
      .catch((error) => { 
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      })
  }, [TOP_SEARCH_GENERAL_ENABLED, TOP_SEARCH_GENERAL_DISPLAY_MODE])

  const addInput = () => {
    setRecommends(items => {
      if (items.length < 5) {
        return [
          ...items,
          {
            id: "",
            name_value: "",
            uri_value: ""
          }
        ];
      }
      return [...items]
    });
  };

  const removeInput = (i: number, recommends: RecommendSettingForm[]) => {
    const items: RecommendSettingForm[] = []
    recommends.filter((recommend, index) => {
      if (index !== i) {
        items.push(recommend)
      }
    })
    setRecommends(items)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string, index: number) => {
    e.preventDefault();
    setRecommends(items => {
      const newArr = items.slice()
      items[index][field] = e.target.value;
      return newArr;
    })
  }
  
  return (
    <div className="">
      <BackButton
        path="/advanced-setting"
        label="Back to Advanced Setting"
        className="my-4"
      />
      <Container>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex justify-between">
              <div>
                <h1 style={{ fontWeight: "700", fontSize: "20px" }}>Top Search</h1>
                <p className="mt-4 mb-6">Config top search</p>
              </div>
              <Button type="submit" className="h-fit">Save</Button>
            </div>

            <div className="flex flex-col gap-y-6 ml-8 w-1/2">
              <Form.Field
                control={form.control}
                name="genaral.enabled.value"
                render={({ field: { onChange, value, ...rest } }) => (
                  <Form.Item className="md:col-span-2">
                    <Form.Label className="font-bold">Enabled Service</Form.Label>
                    <Form.Control>
                      <Select
                        value={value}
                        onValueChange={(newValue) => onChange(newValue)}
                        {...rest}
                      >
                        <Select.Trigger>
                          <Select.Value placeholder="Select attribute type"/>
                        </Select.Trigger>
                        <Select.Content>
                          {enableOptions.map((item) => (
                            <Select.Item key={item.value} value={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage/>
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="genaral.display_mode.value"
                render={({ field: { onChange, value, ...rest } }) => (
                  <Form.Item className="md:col-span-2">
                    <Form.Label className="font-bold">Display Mode</Form.Label>
                    <Form.Control>
                      <Select
                        value={value}
                        onValueChange={(newValue) => onChange(newValue)}
                        {...rest}
                      >
                        <Select.Trigger>
                          <Select.Value placeholder="Select attribute type"/>
                        </Select.Trigger>
                        <Select.Content>
                          {displayModeOptions.map((item) => (
                            <Select.Item key={item.value} value={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage/>
                  </Form.Item>
                )}
              />

              <div className="flex flex-col space-y-2 md:col-span-2">
                <div className="flex items-center gap-x-1">
                  <Form.Label className="font-bold">Can show limit <span className="text-red-400">5</span> product</Form.Label>
                </div>
              </div>

              <div className="flex flex-col space-y-5 md:col-span-2">
                <div className="flex items-center justify-between gap-x-1">
                  <Form.Label className="font-bold">Recommend <span className="font-normal text-neutral-500">(Support internal URL only)</span></Form.Label>
                  <Button type="button" className="h-fit" onClick={addInput}>add</Button>
                </div>
                {recommends.map((item, i) => {
                  return (
                    <div className="relative flex items-center justify-between gap-x-5" key={i.toString()}>
                      <div className="w-6/12">
                        <Input
                          id={`recommend-${i.toString()}`}
                          value={item.name_value}
                          onChange={(e) => handleChange(e, 'name_value', i)}
                          placeholder="Name"
                          type="text"
                        />
                      </div>
                      <div className="w-6/12">
                        <Input
                          id={`recommend-${i.toString()}`}
                          value={item.uri_value}
                          onChange={(e) => handleChange(e, 'uri_value', i)}
                          placeholder="URI"
                          type="text"
                        />
                      </div>
                      <div className="absolute right-[-50px]">
                        <Button type="button" variant="transparent" className="h-fit" onClick={() => removeInput(i, recommends)}>
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
              
          </form>
        </FormProvider>
      </Container>
    </div>
  );
}

export default TopSearchSettingPage;