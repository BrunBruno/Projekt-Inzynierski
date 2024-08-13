
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace chess.Api.Binders.NullableBooleanList;

/// <summary>
/// Binder to convert nullable lists
/// </summary>
public class NullableBooleanListBinder : IModelBinder {
    public Task BindModelAsync(ModelBindingContext bindingContext) {
        var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName).ToString();

        if (string.IsNullOrEmpty(value)) {

            bindingContext.Result = ModelBindingResult.Success(null);

            return Task.CompletedTask;
        }

        var elements = value.Split(',');
        var result = new List<bool?>();

        foreach (var element in elements) {
            if (string.Equals(element, "null", StringComparison.OrdinalIgnoreCase)) {

                result.Add(null);

            } else if (bool.TryParse(element, out var boolValue)) {

                result.Add(boolValue);

            } else {

                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid boolean value");
                bindingContext.Result = ModelBindingResult.Failed();

                return Task.CompletedTask;
            }
        }

        bindingContext.Result = ModelBindingResult.Success(result);

        return Task.CompletedTask;
    }
}
