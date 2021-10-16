import React, { useState } from "react"
import PropTypes from "prop-types"

const TextField = ({ label, type, name, value, onChange, error }) => {
  const [showPassoword, setShowPassoword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassoword((prevState) => !prevState)
  }

  const getInputClasses = () => {
    return "form-control" + (error ? " is-invalid" : "")
  }

  return (
    <div className="mb-4">
      <label htmlFor={name}>{label}</label>
      <div className="input-group has-validation">
        <input
          type={showPassoword ? "text" : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={getInputClasses()}
        />
        {type === "password" && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={toggleShowPassword}
          >
            <i className={"bi bi-eye" + (showPassoword ? "-slash" : "")}></i>
          </button>
        )}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  )
}

TextField.defaultProps = {
  type: "text"
}

TextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string
}
export default TextField