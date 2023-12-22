import { toast } from "react-toastify";
import { getHeaders } from "../utils/platform";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  isCompleted: Yup.boolean().required("Please select completion status"),
  dueDate: Yup.date().nullable().required('Due date is required'),
});

const initialValues = {
    title: '',
    description: '',
    isCompleted: false,
    dueDate: new Date(),
  }

const CreateTodo = () => {
  const onTodoCreate = async (formData: any) => {
    const id = toast.loading("Please wait while updating the todo...");
    try {
      const headers = getHeaders();
      const response = await axios.post(`/todos`, formData,{
        headers,
      });
      const data = response.data;
      if (data?.success) {
        toast.update(id, {
          render: data?.message || "Todo Created successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        window.location.reload();
      } else {
        toast.update(id, {
          render: data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error("Error Creating todo", data?.message);
      }
    } catch (error: any) {
      toast.update(id, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error("Todos Creation failed:", error);
    }
  };

  return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onTodoCreate}
      >
        <Form>
          <div>
            <label htmlFor="title">Title:</label>
            <Field type="text" id="title" name="title" />
            <ErrorMessage name="title" component="div" />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <Field as="textarea" id="description" name="description" />
            <ErrorMessage name="description" component="div" />
          </div>

          <div>
            <label>
              Completed:
              <Field type="radio" name="isCompleted" value={true} /> Yes
              <Field type="radio" name="isCompleted" value={false} /> No
            </label>
            <ErrorMessage name="isCompleted" component="div" />
          </div>

          <div>
            <label htmlFor="dueDate">Due Date:</label>
            <Field name="dueDate">
                {({ field, form, meta }:{field:any,form:any,meta:any}) => (
                <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => form.setFieldValue('dueDate', date)}
                    dateFormat="yyyy-MM-dd"
                />
                )}
            </Field>
            <ErrorMessage name="dueDate" component="div" />
          </div>

          <button type="submit">Save Changes</button>
        </Form>
      </Formik>
    )
};

export default CreateTodo;
