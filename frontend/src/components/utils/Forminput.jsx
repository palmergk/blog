import React from 'react'

const Forminput = ({label, type, placeholder, name, value, onChange, formtype='text'}) => {
    return (
        <div className="mb-3">
            <div className="text-sm">{label}</div>
          {formtype === 'text' &&  <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="outline-none border border-slate-400 p-2 rounded-md w-full" />}
          {formtype === 'textarea' &&  <textarea  name={name} value={value} onChange={onChange} cols="30"placeholder={placeholder} rows="2"className="outline-none border resize-none border-slate-400 p-2 rounded-md w-full"></textarea>}
        </div>
    )
}

export default Forminput