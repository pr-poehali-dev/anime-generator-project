import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Episode {
  number: number;
  title: string;
  duration: string;
  progress: number;
  thumbnail: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [animeTitle, setAnimeTitle] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    if (isGenerating && generationProgress < 100) {
      const timer = setTimeout(() => {
        setGenerationProgress(prev => Math.min(prev + 2, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, generationProgress]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    setIsGenerating(true);
    setGenerationProgress(0);

    setTimeout(() => {
      const title = `${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`;
      setAnimeTitle(title);
      setGenre('Фэнтези / Приключения');

      const newEpisodes: Episode[] = Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        title: `Эпизод ${i + 1}`,
        duration: '24:00',
        progress: Math.random() * 100,
        thumbnail: '/placeholder.svg'
      }));

      setEpisodes(newEpisodes);

      const assistantMessage: Message = {
        role: 'assistant',
        content: `Начинаю генерацию аниме "${title}". Создаю 12 эпизодов с уникальным сюжетом, персонажами и визуальным стилем...`
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      setIsGenerating(false);
      setPrompt('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 tracking-tight">アニメスタジオ</h1>
          <p className="text-muted-foreground text-lg font-light">
            Генератор аниме с помощью ИИ
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6 animate-scale-in shadow-lg border-2">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Sparkles" className="text-accent" size={24} />
                <h2 className="text-2xl font-semibold">Создать аниме</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Опишите сюжет вашего аниме
                  </label>
                  <Input
                    placeholder="Например: школьник открывает портал в магический мир..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    className="h-12 text-base"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Icon name="Loader2" className="animate-spin" size={20} />
                      Генерация...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Icon name="Play" size={20} />
                      Создать аниме
                    </span>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс генерации</span>
                      <span className="font-medium">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 max-h-[500px] overflow-y-auto animate-slide-in-up shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="MessageSquare" className="text-primary" size={24} />
                <h2 className="text-xl font-semibold">История</h2>
              </div>

              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  Начните создавать своё аниме...
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl animate-fade-in ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            {animeTitle && (
              <Card className="p-6 animate-scale-in shadow-lg border-2">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{animeTitle}</h2>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="font-normal">
                        <Icon name="Tag" size={14} className="mr-1" />
                        {genre}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        <Icon name="Film" size={14} className="mr-1" />
                        12 серий
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Студия</p>
                      <p className="font-medium">AI Studio</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Год</p>
                      <p className="font-medium">2025</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Качество</p>
                      <p className="font-medium">4K Ultra HD</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Озвучка</p>
                      <p className="font-medium">Японская + Русская</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {episodes.length > 0 && (
              <Card className="p-6 animate-slide-in-up shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Эпизоды</h2>
                  <Badge className="font-normal">
                    {episodes.length} серий
                  </Badge>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {episodes.map((episode) => (
                    <Card
                      key={episode.number}
                      className="p-4 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          <Icon name="Play" className="text-muted-foreground" size={24} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-sm">
                                {episode.number}. {episode.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {episode.duration}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(episode.progress)}%
                            </Badge>
                          </div>
                          
                          <Progress value={episode.progress} className="h-1.5" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
