import React, { useEffect, useState } from "react"
import { validator } from "../../../utils/validator"
import TextField from "../../common/form/textField"
import SelectField from "../../common/form/selectField"
import RadioField from "../../common/form/radioField"
import MultiSelectField from "../../common/form/multiSelectField"
import BackHistoryButton from "../../common/backButton"
import { useDispatch, useSelector } from "react-redux"
import {
    getQualities,
    getQualitiesLoadingStatus
} from "../../../store/qualities"
import {
    getProfessions,
    getProfessionsLoadingStatus
} from "../../../store/professions"
import { getCurrentUserData, updateUserData } from "../../../store/users"

const EditUserPage = () => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()
    const currentUser = useSelector(getCurrentUserData())

    const professions = useSelector(getProfessions())
    const professionsLoading = useSelector(getProfessionsLoadingStatus())
    const professionsList = professions.map((p) => ({
        label: p.name,
        value: p._id
    }))

    const qualities = useSelector(getQualities())
    const qualitiesLoading = useSelector(getQualitiesLoadingStatus())
    const qualitiesList = qualities.map((q) => ({
        label: q.name,
        value: q._id
    }))

    const [errors, setErrors] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()
        const isValid = validate()
        if (!isValid) return
        dispatch(
            updateUserData({
                ...data,
                qualities: data.qualities.map((q) => q.value)
            })
        )
    }

    function getQualitiesListByIds(qualitiesIds) {
        const qualitiesArray = []
        for (const qualId of qualitiesIds) {
            for (const quality of qualities) {
                if (quality._id === qualId) {
                    qualitiesArray.push(quality)
                    break
                }
            }
        }
        return qualitiesArray
    }

    const transformData = (data) => {
        return getQualitiesListByIds(data).map((qual) => ({
            label: qual.name,
            value: qual._id
        }))
    }
    useEffect(() => {
        if (!professionsLoading && !qualitiesLoading && currentUser && !data) {
            setData({
                ...currentUser,
                qualities: transformData(currentUser.qualities)
            })
        }
    }, [professionsLoading, qualitiesLoading, currentUser, data])

    useEffect(() => {
        if (data && isLoading) {
            setIsLoading(false)
        }
    }, [data])

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: { message: "Электронная почта введена не корректно" }
        },
        name: {
            isRequired: {
                message: "Имя обязательна для заполнения"
            },
            min: {
                message: "Имя должео состоять минимум из 3 символов",
                value: 3
            }
        }
    }

    useEffect(() => {
        validate()
    }, [data])

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }))
    }

    const validate = () => {
        const errors = validator(data, validatorConfig)
        setErrors(errors)
        return Object.keys(errors).length === 0
    }

    const isValid = Object.keys(errors).length !== 0

    return (
        <div className="container mt-3 ">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading > 0 &&
                    currentUser.qualities.length > 0 &&
                    Object.keys(professions).length > 0 ? (
                        <form onSubmit={handleSubmit} className="ms-3">
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выберите свою профессию"
                                defaultOption="Выбрать..."
                                options={professionsList}
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                                name="profession"
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                                defaultValue={data.qualities}
                            />
                            <button
                                type="submit"
                                disabled={isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Изменить
                            </button>
                        </form>
                    ) : (
                        <h1 className="ms-3">Loading...</h1>
                    )}
                </div>
            </div>
        </div>
    )
}
export default EditUserPage
