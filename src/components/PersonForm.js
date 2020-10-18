import React, { useRef } from 'react';

const PersonForm = ({ handleAddPerson }) => {
  const nameInput = useRef();
  const phoneNumInput = useRef();

  const submit = e => {
    e.preventDefault();
    handleAddPerson(nameInput.current.value, phoneNumInput.current.value, phoneNumInput, nameInput);
    // nameInput.current.value = '';
    // phoneNumInput.current.value = '';
    // nameInput.current.focus();
  }

  return (
    <>
      <form onSubmit={submit}>
        <div>name: &nbsp;
          <input
            ref={nameInput}
            type="text"
            placeholder={'enter person\'s name'}
            required
          />
        </div>
        <div>phone number: &nbsp;
          <input
            ref={phoneNumInput}
            type="text"
            placeholder={'xxx-xxx-xxxx'}
            required
          />
        </div>
        <button type="submit">Add Person</button>
      </form>
    </>
  )
}

export default PersonForm;