export default function Controls({
    disabled,
    iteration,
    onGenerate,
    onImport,
    onNextStep,
    onUndo
}) {
    return (
        <div className="buttons">
            <button onClick={onGenerate}>Generate</button>
            <button onClick={onImport}>Import</button>
            <button disabled={disabled} onClick={onNextStep}>Next Step</button>
            <button disabled={disabled} onClick={onUndo}>Undo</button>

            <span className="step-counter">
                Iteration {iteration}
            </span>
        </div>
    )
}
