import React, { useEffect, useState } from "react"
import SelectField from "../../components/common/form/selectField"
import api from "../../api"
import { validator } from "../../../utils/validator"
import TextAreaField from "../common/form/textAreaField"
import PropTypes from "prop-types"

const CommentForm = ({ pageId, handleNewComment }) => {
  const initialState = { userId: "", content: "", pageId }
  const [data, setData] = useState(initialState)
  const [users, setUsers] = useState()
  const [errors, setErrors] = useState({})

  useEffect(() => {
    api.users.fetchAll().then((data) => setUsers(data))
  }, [])

  const handleChange = (target) => {
    console.log(target)
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }))
  }

  const validatorConig = {
    userId: {
      isRequired: { message: "Обязательно выберите получателя" }
    },
    content: { isRequired: { message: "Введите текст сообщения" } }
  }

  useEffect(() => {
    validate()
  }, [data])

  const validate = () => {
    const errors = validator(data, validatorConig)
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValid = Object.keys(errors).length !== 0

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validate()
    if (!isValid) return
    api.comments.add(data)
    console.log(data)
    handleNewComment(data.pageId)
    setData(initialState)
  }

  return (
    <div className="card mb-2">
      <div className="card-body">
        <div>
          <h2>New comment</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <SelectField
                defaultOption="Выберите пользователя..."
                error={errors.userId}
                value={data.userId}
                label="Выберите пользователя"
                options={users}
                onChange={handleChange}
                name="userId"
              />
            </div>
            <TextAreaField
              rows="3"
              onChange={handleChange}
              name="content"
              label="Сообщение"
              value={data.content}
            />
            <button className="btn-primary btn float-end" disabled={isValid}>
              Опубликовать
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

CommentForm.propTypes = {
  handleNewComment: PropTypes.func,
  pageId: PropTypes.string
}

export default CommentForm