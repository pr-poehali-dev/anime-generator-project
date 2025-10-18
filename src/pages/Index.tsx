import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Character {
  name: string;
  role: string;
  description: string;
}

interface Song {
  title: string;
  artist: string;
}

interface Episode {
  number: number;
  title: string;
  synopsis: string;
  fullStory: string;
  duration: string;
  opening: Song;
  ending: Song;
  keyMoments: string[];
}

interface AnimeData {
  title: string;
  title_japanese: string;
  genre: string;
  synopsis: string;
  characters: Character[];
  episodes: Episode[];
  art_style: string;
  themes: string[];
  studio: string;
  year: number;
  quality: string;
  audio: string;
  opening: Song;
  ending: Song;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);

  useEffect(() => {
    if (isGenerating && generationProgress < 100) {
      const timer = setTimeout(() => {
        setGenerationProgress(prev => Math.min(prev + 2, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, generationProgress]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const response = await fetch('https://functions.poehali.dev/37ca87c2-1c6b-49c8-9322-e135aa9f3a9e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Ошибка генерации');
      }

      const data: AnimeData = await response.json();
      setAnimeData(data);

      const assistantMessage: Message = {
        role: 'assistant',
        content: `Создано аниме "${data.title}"! ${data.synopsis.slice(0, 100)}...`
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Произошла ошибка при генерации. Попробуйте ещё раз.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
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
            {animeData && (
              <>
                <Card className="p-6 animate-scale-in shadow-lg border-2">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-1">{animeData.title}</h2>
                      <p className="text-sm text-muted-foreground mb-3">{animeData.title_japanese}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="font-normal">
                          <Icon name="Tag" size={14} className="mr-1" />
                          {animeData.genre}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          <Icon name="Film" size={14} className="mr-1" />
                          {animeData.episodes.length} серий
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{animeData.synopsis}</p>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Студия</p>
                        <p className="font-medium">{animeData.studio}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Год</p>
                        <p className="font-medium">{animeData.year}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Качество</p>
                        <p className="font-medium">{animeData.quality}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Озвучка</p>
                        <p className="font-medium">{animeData.audio}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Стиль рисовки</p>
                      <p className="text-sm">{animeData.art_style}</p>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Темы</p>
                      <div className="flex flex-wrap gap-2">
                        {animeData.themes.map((theme, idx) => (
                          <Badge key={idx} variant="outline" className="font-normal text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">🎵 Опенинг</p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium text-sm">{animeData.opening.title}</p>
                          <p className="text-xs text-muted-foreground">{animeData.opening.artist}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">🎵 Эндинг</p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium text-sm">{animeData.ending.title}</p>
                          <p className="text-xs text-muted-foreground">{animeData.ending.artist}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {animeData.characters.length > 0 && (
                  <Card className="p-6 animate-scale-in shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="Users" size={24} className="text-primary" />
                      <h2 className="text-xl font-semibold">Персонажи</h2>
                    </div>
                    <div className="space-y-3">
                      {animeData.characters.map((character, idx) => (
                        <div key={idx} className="p-4 bg-muted rounded-lg">
                          <h3 className="font-semibold mb-1">{character.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{character.role}</p>
                          <p className="text-xs">{character.description}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <Card className="p-6 animate-slide-in-up shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Эпизоды</h2>
                    <Badge className="font-normal">
                      {animeData.episodes.length} серий
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {animeData.episodes.map((episode) => (
                      <Card
                        key={episode.number}
                        className="p-4 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        onClick={() => setSelectedEpisode(episode)}
                      >
                        <div className="space-y-3">
                          <div className="flex gap-4">
                            <div className="w-20 h-14 bg-gradient-to-br from-accent to-accent/50 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-2xl font-bold text-primary">{episode.number}</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm mb-1">
                                {episode.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {episode.synopsis}
                              </p>
                              <div className="flex items-center gap-2">
                                <Icon name="Clock" size={12} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{episode.duration}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 text-xs border-t pt-2">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Icon name="Music" size={12} />
                              <span>OP: {episode.opening.title}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Icon name="Music" size={12} />
                              <span>ED: {episode.ending.title}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        {selectedEpisode && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEpisode(null)}
          >
            <Card 
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card border-b p-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="text-lg px-3 py-1">Серия {selectedEpisode.number}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>{selectedEpisode.duration}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedEpisode.title}</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedEpisode(null)}
                  className="shrink-0"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    Краткое описание
                  </h3>
                  <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {selectedEpisode.synopsis}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Icon name="BookOpen" size={16} />
                    Полный сюжет серии
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {selectedEpisode.fullStory}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Icon name="Sparkles" size={16} />
                    Ключевые моменты
                  </h3>
                  <div className="space-y-2">
                    {selectedEpisode.keyMoments.map((moment, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <p className="text-sm flex-1">{moment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Icon name="Music" size={14} />
                      Опенинг
                    </h3>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm">{selectedEpisode.opening.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedEpisode.opening.artist}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Icon name="Music" size={14} />
                      Эндинг
                    </h3>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium text-sm">{selectedEpisode.ending.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedEpisode.ending.artist}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;