
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.GetRegisterConf;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class GetRegisterConfRequestHandlerTests {

    private readonly Mock<IUserDataConfigurationRepository> _mockDataConfigurationRepository;

    public GetRegisterConfRequestHandlerTests() {
        _mockDataConfigurationRepository = new Mock<IUserDataConfigurationRepository>();
    }

    [Fact]
    public async Task Handle_Returns_Register_Configuration_On_Success() {

        var dataConfiguration = new Entities.UserDataConfiguration()
        {
            Id = (int)Enums.DataConfiguration.UserPassword,
        };

        var request = new GetRegisterConfRequest()
        {
            ConfigurationId = (int)Enums.DataConfiguration.UserPassword,
        };


        _mockDataConfigurationRepository.Setup(x => x.GetById(dataConfiguration.Id)).ReturnsAsync(dataConfiguration);


        var handler = new GetRegisterConfRequestHandler(
            _mockDataConfigurationRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        _mockDataConfigurationRepository.Verify(x => x.GetById(request.ConfigurationId), Times.Once);
    }

    [Fact]
    public async Task Handle_Returns_BadRequestException_When_ConfigurationId_Is_Incorrect() {

        var request = new GetRegisterConfRequest()
        {
            ConfigurationId = 1000, // incorrect id
        };


        var handler = new GetRegisterConfRequestHandler(
            _mockDataConfigurationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockDataConfigurationRepository.Verify(x => x.GetById(request.ConfigurationId), Times.Never);
    }

    [Fact]
    public async Task Handle_Returns_NotFoundException_When_DataConfiguration_Not_Exists() {

        var request = new GetRegisterConfRequest()
        {
            ConfigurationId = (int)Enums.DataConfiguration.UserPassword,
        };


        // configuration not returned


        var handler = new GetRegisterConfRequestHandler(
            _mockDataConfigurationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockDataConfigurationRepository.Verify(x => x.GetById(request.ConfigurationId), Times.Once);
    }
}
