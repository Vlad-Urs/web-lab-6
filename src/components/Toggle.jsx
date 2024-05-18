import "./Toggle.css"
import tg_icon from '../assets/toggle_icon.png'

export const Toggle = ({handleChange, isChecked}) => {
    return (
        <div className="toggle-container">
            <input 
              type="checkbox"
              id = "check"
              className="toggle"
              onChange={handleChange}
              checked={isChecked}
            />
            <label htmlFor="check">🌗</label>
        </div>
    );
};