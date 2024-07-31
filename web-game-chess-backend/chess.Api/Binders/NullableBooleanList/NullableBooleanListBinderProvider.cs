
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace chess.Api.Binders.NullableBooleanList;

public class NullableBooleanListBinderProvider : IModelBinderProvider {
    public IModelBinder? GetBinder(ModelBinderProviderContext context) {

        if (context.Metadata.ModelType == typeof(List<bool?>)) 
            return new BinderTypeModelBinder(typeof(NullableBooleanListBinder));
        
        return null;
    }
}
