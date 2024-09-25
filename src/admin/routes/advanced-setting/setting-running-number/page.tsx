import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { InformationCircle } from "@medusajs/icons";
import {
  Container,
  Button,
  Select,
  Tooltip,
  Input,
  Toaster,
  toast,
} from "@medusajs/ui";
import BackButton from "../../../components/back-button";
import { findConfigDataByPath } from "../../../utils/config-data";

const items = [
  {
    value: "0",
    label: "No",
  },
  {
    value: "1",
    label: "Yes",
  },
];

const CustomOrderNumberPage = () => {
  const { handleSubmit, control, setValue } = useForm();
  const [ isLoading, setIsLoading ] = useState(true);

  const RUNNING_NUMBER_ORDER_ISENABLE = "running_number/order/is_enable";
  const RUNNING_NUMBER_ORDER_FORMAT = "running_number/order/format";
  const RUNNING_NUMBER_ORDER_COUNTER_INCREMENT =
    "running_number/order/counter_increment";
  const RUNNING_NUMBER_ORDER_COUNTER_PADDING =
    "running_number/order/counter_padding";
  const RUNNING_NUMBER_ORDER_CURRENT_NO = "running_number/order/current_no";
  const RUNNING_NUMBER_ORDER_CURRENT_PREFIX =
    "running_number/order/current_prefix";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          'paths[0]': RUNNING_NUMBER_ORDER_ISENABLE,
          'paths[1]': RUNNING_NUMBER_ORDER_FORMAT,
          'paths[3]': RUNNING_NUMBER_ORDER_COUNTER_INCREMENT,
          'paths[4]': RUNNING_NUMBER_ORDER_COUNTER_PADDING,
        });
        const response = await fetch(`/admin/config-data?${params.toString()}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            return res.data;
          });
        console.log("log data index 0:", response);

        const data = response;

        const is_enable = findConfigDataByPath(
          data,
          RUNNING_NUMBER_ORDER_ISENABLE
        );
        const format = findConfigDataByPath(data, RUNNING_NUMBER_ORDER_FORMAT);
        const counter_increment = findConfigDataByPath(
          data,
          RUNNING_NUMBER_ORDER_COUNTER_INCREMENT
        );
        const counter_padding = findConfigDataByPath(
          data,
          RUNNING_NUMBER_ORDER_COUNTER_PADDING
        );

        // Set the values in the form using setValue
        setValue("is_enable", is_enable !== "" ? is_enable : "0");
        setValue("format", format !== "" ? format : "{yy}{mm}{dd}{counter}");
        setValue(
          "counter_increment",
          counter_increment !== "" ? counter_increment : "1"
        );
        setValue(
          "counter_padding",
          counter_padding !== "" ? counter_padding : "4"
        );
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [ setValue ]);

  const onSubmit = async (formData) => {
    const data = {
      order: {
        is_enable: {
          path: RUNNING_NUMBER_ORDER_ISENABLE,
          value: formData.is_enable,
        },
        format: {
          path: RUNNING_NUMBER_ORDER_FORMAT,
          value: formData.format,
        },
        counter_increment: {
          path: RUNNING_NUMBER_ORDER_COUNTER_INCREMENT,
          value: formData.counter_increment.toString(),
        },
        counter_padding: {
          path: RUNNING_NUMBER_ORDER_COUNTER_PADDING,
          value: formData.counter_padding.toString(),
        },
        current_no: {
          path: RUNNING_NUMBER_ORDER_CURRENT_NO,
          value: "",
        },
        current_prefix: {
          path: RUNNING_NUMBER_ORDER_CURRENT_PREFIX,
          value: "",
        },
      },
    };
    try {
      const response = await fetch("/admin/config-data", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success("Success", {
          description: "Order number settings were successfully updated.",
          dismissLabel: "Close",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred. Please try again.",
        dismissLabel: "Close",
      });
    }
  };

  return (
    <div className="">
      <BackButton
        path="/advanced-setting"
        label="Back to Advanced Setting"
        className="my-4"
      />

      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold text-xl">Custom Order Number</h1>
              <p>Manage your order, invoice, shipping, credit memo number</p>
            </div>
            <Toaster/>
            <Button className="h-fit" type="submit">
              Save
            </Button>
          </div>
          {/* Content */}
          <div className="mt-10 mb-10">
            <h2 className="font-bold mb-6">Order</h2>
            <div className="flex flex-col gap-y-6 ml-8 w-1/2">
              {/* Enable */}
              <div>
                <div className="flex items-center mb-2">
                  <label className="font-semibold text-sm">{"Enabled"}</label>
                  <span className="text-rose-500 mr-2">*</span>
                  <Tooltip content="[all store]">
                    <InformationCircle/>
                  </Tooltip>
                </div>
                <Controller
                  name="is_enable"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder={"Enabled"}/>
                      </Select.Trigger>
                      <Select.Content>
                        {items.map((item) => (
                          <Select.Item key={item.value} value={item.value}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  )}
                />
              </div>
              {/* Enable */}

              {/* Number Format */}
              <div>
                <div className="flex items-center mb-2">
                  <label className="font-semibold text-sm">
                    {"Number Format"}
                  </label>
                  <span className="text-rose-500 mr-2">*</span>
                  <Tooltip content="[all store]">
                    <InformationCircle/>
                  </Tooltip>
                </div>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="UT-D-{yy}{mm}{dd}{counter}"
                      className="mb-2"
                      required={true}
                    />
                  )}
                />
                <p className="text-xs text-gray-500">
                  You can use variables {"{yyyy}, {yy}, {m}, {mm}, {d}, {dd}."}{" "}
                  If you type ORD-{"{yy}-{mm}-{dd}-{counter}"} in the field, you
                  will have order numbers of the kind: ORD-13-08-15-000077
                </p>
              </div>
              {/* Number Format */}

              {/* Counter Increment Step */}
              <div>
                <div className="flex items-center mb-2">
                  <label className="font-semibold text-sm">
                    {"Counter Increment Step"}
                  </label>
                  <span className="text-rose-500 mr-2">*</span>
                  <Tooltip content="[all store]">
                    <InformationCircle/>
                  </Tooltip>
                </div>
                <Controller
                  name="counter_increment"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="mb-2 "
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      required={true}
                    />
                  )}
                />

                <p className="text-xs text-gray-500">
                  E.g. the last number is 0009. If increment step is 2, the next
                  number will be 00011
                </p>
              </div>
              {/* Counter Increment Step */}

              {/* Counter Padding */}
              <div>
                <div className="flex items-center mb-2">
                  <label className="font-semibold text-sm">
                    {"Counter Padding"}
                  </label>
                  <span className="text-rose-500 mr-2">*</span>
                  <Tooltip content="[all store]">
                    <InformationCircle/>
                  </Tooltip>
                </div>
                <Controller
                  name="counter_padding"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="mb-2 "
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      required={true}
                    />
                  )}
                />
                <p className="text-xs text-gray-500">
                  Total number of digits in the order number. If the order id is
                  24 and padding is 5, the result will be 00024. Set to 0 (zero)
                  not to add leading zeros.
                </p>
              </div>
              {/* Counter Padding */}
            </div>
          </div>
        </form>

        {/* Content */}
      </Container>
    </div>
  );
};

export default CustomOrderNumberPage;
