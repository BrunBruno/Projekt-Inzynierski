
using chess.Application.Repositories;
using Moq;

namespace chess.Core.Tests.User;

public class GetRegisterConfRequestHandlerTests {

    private readonly Mock<IDataConfigurationRepository> _mockDataConfigurationRepository;

    public GetRegisterConfRequestHandlerTests() {
        _mockDataConfigurationRepository = new Mock<IDataConfigurationRepository>();
    }
}
